import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    }
},
{
    timestamps: true,
    versionKey: false
});

export default model('Task', taskSchema);
