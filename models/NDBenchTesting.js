import mongoose, { SchemaTypes } from 'mongoose'

const NDBenchTestingSchema = new mongoose.Schema({
    CPUUtilization_Average: {
        type: String,
        required: true
    },
    NetworkIn_Average: {
        type: String,
        required: true
    },
    NetworkOut_Average: {
        type: String,
        required: true
    },
    MemoryUtilization_Average: {
        type: String,
        required: true
    },
    Final_Target: {
        type: String,
        required: true
    },
}, { timestamps: true })
export default mongoose.models.NDBenchTesting || mongoose.model("NDBenchTesting", NDBenchTestingSchema)