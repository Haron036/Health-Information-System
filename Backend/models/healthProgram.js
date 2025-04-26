import mongoose from 'mongoose'

const healthProgramSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true, versionKey: false });

const HealthProgram = mongoose.model('HealthProgram', healthProgramSchema);
export default HealthProgram;
