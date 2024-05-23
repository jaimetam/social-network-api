const { Schema, model } = require('mongoose');


const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },

    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },

    username: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const thoughtsSchema = new Schema(
{
 thoughtsText:{
    type: String,
     required: true,
     min_length: 1,
     max_length: 280,
    },

    createdAt:{
     type: Date,
     default: Date.now,
     get: timestamp =>timestamp.toISOString()
    },

    username:{
     type: String,
     require: true,
    },

   reactions: [reactionSchema],
},
{ 
    toJson:{
        getters: true,
    },
    virtuals: true,
 }

);


thoughtsSchema.virtual('reactionCount',{
    get(){
        return thoughts.reaction.length;
    }
});

module.exports = model('thoughts', thoughtsSchema);