const Workout = require('../models/Workout');
const { errorHandler } = require('../auth');


// Add Workout
module.exports.addWorkout = (req, res) => {

    let newWorkout = new Workout({

        name: req.body.name,
        duration: req.body.duration,
        userId: req.user.id

    });

    return newWorkout.save()
    .then(workout => {

        return res.status(201).send({
            message: 'Workout added successfully',
            workout
        });

    })
    .catch(error => errorHandler(error, req, res));
};


// Get My Workouts
module.exports.getMyWorkouts = (req, res) => {

    return Workout.find({ userId: req.user.id })
    .then(workouts => {

        return res.status(200).send(workouts);

    })
    .catch(error => errorHandler(error, req, res));
};


// Update Workout
module.exports.updateWorkout = (req, res) => {

    const updatedWorkout = {

        name: req.body.name,
        duration: req.body.duration,
        status: req.body.status

    };

    return Workout.findByIdAndUpdate(
        req.params.workoutId,
        updatedWorkout,
        { new: true }
    )
    .then(workout => {

        if (!workout) {
            return res.status(404).send({
                error: 'Workout not found'
            });
        }

        return res.status(200).send({
            message: 'Workout updated successfully',
            workout
        });

    })
    .catch(error => errorHandler(error, req, res));
};


// Complete Workout Status
module.exports.completeWorkoutStatus = (req, res) => {

    return Workout.findOneAndUpdate(
        {
            _id: req.params.workoutId,
            userId: req.user.id
        },
        {
            status: 'completed'
        },
        {
            new: true
        }
    )
    .then(workout => {

        if (!workout) {
            return res.status(404).send({
                error: 'Workout not found'
            });
        }

        return res.status(200).send({
            message: 'Workout status updated successfully',
            workout
        });

    })
    .catch(error => errorHandler(error, req, res));
};


// Delete Workout
module.exports.deleteWorkout = (req, res) => {

    return Workout.findByIdAndDelete(req.params.workoutId)
    .then(workout => {

        if (!workout) {
            return res.status(404).send({
                error: 'Workout not found'
            });
        }

        return res.status(200).send({
            message: 'Workout deleted successfully'
        });

    })
    .catch(error => errorHandler(error, req, res));
};