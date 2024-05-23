
const { model } = require('mongoose');
const {user, thoughts, } = require('../models');

module.exports = {

    async getThoughts(req, res){
        try{
            const Thoughts = await thoughts.find()
            res.json(Thoughts);
        } catch (err) {
            res.status(500).json(err);
        }    
    },
    async getSingleThought(req, res){
        try{
            const Thoughts = await thoughts.findOne({_id: req.params.thoughtsId})
            

            if(!Thoughts){
                return res.status(404).json({message: 'No thought found with  this id ' });
            }
        res.json(Thoughts);
        } catch (err){
            res.status(500).json(err);
        }
    },

    async createThought(req, res){
        try{
            const Thought = await thoughts.create(req.body);
            res.json(Thought);
        } catch (err){
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const Thought= await thoughts.findOneAndDelete(req.params.thoughtsId);

            if(!Thought){
                res.status(404).json({message: 'No thought with this ID'});
                return;
            }
            res.json({message:'thought deleted'});
        } catch (err){
            res.status(500).json(err);
        }
    },

    async updateThought(req, res){
        try{
           const updateThought = await thoughts.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
           );
          res.json(updateThought);
        }catch (err){
         res.status(500).json(err);
        }
    },

    async addReaction(req, res) {
        console.log('You are adding a reaction');
        console.log(req.body);
    
        try {
          const Thought = await thoughts.findByIdAndUpdate(
             req.params.thoughtsId,
            { $push: { reaction: req.body } },
            { new: true }
          );
    
          if (!Thought) {
            return res.status(404).json({ message: 'No thought found with that ID :(' });
          }
    
          res.json(Thought);
        } catch (err) {
          res.status(500).json(err);
        }
      },

      async removeReaction(req, res) {
        try {
          const Thought = await thoughts.findByIdAndUpdate(
            { _id: req.params.thoughtsId },
            { $pull: { reaction: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
          );
    
          if (!Thought) {
            return res
              .status(404)
              .json({ message: 'No thought found with that ID :(' });
          }
    
          res.json(Thought);
        } catch (err) {
          res.status(500).json(err);
        }
      },

};