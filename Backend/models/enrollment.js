     import mongoose from'mongoose';
     const enrollmentSchema = new mongoose.Schema({
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true
        },
        programs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HealthProgram',
            required: true
        }],
        enrollmentDate: {
            type: Date,
            default: Date.now
        }
    }, { timestamps: true });

     const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
     export default Enrollment;
     