
const { model } = require('mongoose');
const {user, thoughts} = require('../models');


const allUsers = async () =>{
    const numberOfUsers = await user.aggregate()
     .count('userCount');
    return numberOfUsers;
}



//get all users 
module.exports = {
    async getUsers(req, res){
        try {
            const users = await user.find().populate('thoughts').populate('friends');
            const userObj = {
                users,
                allUsers: await allUsers(),
            };
          res.json(userObj);  
        } catch (err){
        console.log(err);
        return res.status(500).json(err);
        }
    },
    async getSingleUser(req, res){
        try {
            const User = await user.findOne({_id: req.params.userId })
            .populate('thoughts')
            .populate('friends')
            .select('-__v');

            if(!User){
                return res.status(400).json({message: 'No user with this ID'})
            }
            
            res.json(User)
        } catch(err){
            console.log(err)
            res.status(500).json({message: 'Internal server error'})
        }
    },
    async createUser(req, res) {
        try{
       const { username, email} = req.body;

       if (!username || !email) {
        return res.status(400).json({ message: 'Missing required fields: username and email' });
      }
           // Create new user instance with validated data
            const newUser = new user({ username, email });

            // Save the user to the database
              const savedUser = await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    }catch (err) {
        console.log(err); 
    }

    },

    async updateUser(req, res){
        try {
            const userId = req.params.userId;
            const updates = req.body;

            const updatedUser = await user.findByIdAndUpdate(userId, updates, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

        res.json({ message: 'User updated successfully', user: updatedUser });   
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteUser(req, res ){
        try {
            const User = await user.findByIdAndDelete({_id: req.params.userId});

            if (!User || !User.thoughts || !user.thoughts.length === 0){
                const thoughtsToDelete = await thoughts.find({ author: User });
                
                await thoughts.deleteMany({ _id: { $in: thoughtsToDelete.map(thought => thought._id) } });
            }
            
            res.json({ message: 'User deleted successfully' });
        } catch (err){
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async addFriend(req, res){
        console.log('You are adding a friend');
        console.log(req.body);

        try {
            const User = await user.findByIdAndUpdate(
                 req.params.userId,
                {$addToSet:{friends: req.params.friendsId}},
                { runValidators: true, new: true }
            );
            if (!User) {
                return res
                  .status(404)
                  .json({ message: 'No User found with that ID :(' });
            }
        res.json(User);
        } catch (err){
            res.status(500).json(err);
        }
    },

    async DeleteFriend(req, res){
        try {
            const User = await user.findByIdAndUpdate(
                 req.params.userId,
                {$pull: {friends: req.params.friendsId}},
                { runValidators: true, new: true }
            );

            if (!User) {
                return res
                  .status(404)
                  .json({ message: 'No User found with that ID :(' });
            }

        res.json(User); 
        } catch (err) {
            res.status(500).json(err);
        }
    }
  
};
