import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    leader: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Project', projectSchema);
