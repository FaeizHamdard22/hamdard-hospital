import Patient from '../models/Patient.model.js';

export const createPatient = async (req, res) => {
    try {
        const patientData = {
            ...req.body,
            createdBy: req.user.id
        };
        
        const patient = await Patient.create(patientData);
        
        res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            patient
        });
    } catch (error) {
        res.status(400).json({ 
            error: 'Failed to create patient', 
            details: error.message 
        });
    }
};

export const getPatients = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            status 
        } = req.query;
        
        const query = {};
        
        // Search functionality
        if (search) {
            query.$or = [
                { patientId: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        
        const [patients, total] = await Promise.all([
            Patient.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .populate('createdBy', 'username email'),
            Patient.countDocuments(query)
        ]);
        
        res.json({
            success: true,
            patients,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch patients', 
            details: error.message 
        });
    }
};

export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
            .populate('createdBy', 'username email');
            
        if (!patient) {
            return res.status(404).json({ 
                error: 'Patient not found' 
            });
        }
        
        res.json({ success: true, patient });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch patient' 
        });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!patient) {
            return res.status(404).json({ 
                error: 'Patient not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Patient updated successfully',
            patient
        });
    } catch (error) {
        res.status(400).json({ 
            error: 'Failed to update patient', 
            details: error.message 
        });
    }
};

export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { status: 'inactive' },
            { new: true }
        );
        
        if (!patient) {
            return res.status(404).json({ 
                error: 'Patient not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Patient marked as inactive'
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to delete patient' 
        });
    }
};

export const getPatientStats = async (req, res) => {
    try {
        const stats = await Patient.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$count' },
                    statuses: { $push: { status: '$_id', count: '$count' } }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    statuses: 1
                }
            }
        ]);
        
        const genderStats = await Patient.aggregate([
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const ageStats = await Patient.aggregate([
            {
                $bucket: {
                    groupBy: '$age',
                    boundaries: [0, 18, 30, 50, 70, 100],
                    default: '100+',
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);
        
        res.json({
            success: true,
            stats: stats[0] || { total: 0, statuses: [] },
            genderStats,
            ageStats
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch statistics' 
        });
    }
};