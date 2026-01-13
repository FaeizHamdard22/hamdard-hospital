import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        unique: true,
        required: false // Not required - auto-generated in pre-save hook
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 150
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    dateOfBirth: Date,
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    medicalHistory: [{
        condition: String,
        diagnosisDate: Date,
        status: String
    }],
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null]
    },
    allergies: [String],
    currentMedications: [String],
    notes: String,
    status: {
        type: String,
        enum: ['active', 'inactive', 'discharged'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Auto-generate full name
patientSchema.pre('save', function(next) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
    next();
});

// Auto-generate patient ID
patientSchema.pre('save', async function(next) {
    // Only generate patientId for new documents that don't have one
    if (!this.isNew || this.patientId) return next();
    
    try {
        const year = new Date().getFullYear();
        const count = await this.constructor.countDocuments({
            patientId: new RegExp(`^PAT-${year}-`)
        });
        
        this.patientId = `PAT-${year}-${(count + 1).toString().padStart(5, '0')}`;
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('Patient', patientSchema);