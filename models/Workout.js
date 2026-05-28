const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Workout name is required']
    },

    duration: {
        type: Number,
        required: [true, 'Duration is required']
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },

    dateAdded: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        default: 'pending'
    }

});

module.exports = mongoose.model('Workout', workoutSchema);