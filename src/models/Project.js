import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        leader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        pendingMembers: [{
            type: String 
        }],
        tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }]
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Project", projectSchema);