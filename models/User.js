const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
      message: 'The email address is invalid.'
    }
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'thoughts' 
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }]
  },
  {
    toJSON: {
        virtuals: true,
    }
});
userSchema.virtual('friendCount').get(function(){
  return this.friends.length;
});
    
 

module.exports = model('user', userSchema);