//required modules for the USER model

let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let User = mongoose.Schema(
     {
          email:
          {
               type: String,
               default: '',
               trim: true,
               required: 'email address is required'
          },
          username:
          {
               type:String,
               default:"",
               trim:true,
               required:'username is required'
          },

          //    password: 
          //    {
          //        type: String,
          //        default: '',
          //        trim: true,
          //        required: 'password is required'
          //    }    
          created: {
               type: Date,
               default: Date.now
          },
          update: {
               type: Date,
               default: Date.now
          }
     },
     {
          collection: "users"
     }

);

let options=({missingPasswordError:'Wrong / Missing Password'});

User.plugin(passportLocalMongoose,options);


// const User = mongoose.model('User', UserSchema)
module.exports.User = mongoose.model('User',User);