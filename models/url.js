const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var shortHash = require('short-hash');
const validateURL = require('url-validate');
var validatorurl = require('validator');
// var useragent = require('express-useragent');

const urlSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    original_url: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
            //    return validateURL(value);
                return validatorurl.isURL(value, { protocols: ['http','https','ftp'], require_protocol:true} );
                // console.log(validatorurl.isURL(value));
            },
            message: function(props){
                return 'Invalid url'
            }
        }
    },
    tags:  {
        type: String,
        required: true
    },
    hashed_url: {
        type: String,
    },
    created_at: {
        type: String
    },

    info: [
        {
            clicked_date: {
                type: String
            },
            ip_address: {
                type: String
            },
            browser_name: {
                type: String
            },
            Os_type: {
                type: String
            }
            // Device_type: {
            //     type: String
            // }
        }  
    ]
});

//creating date
urlSchema.pre('save', function(){
    this.created_at = `${new Date().toString()}`;
});

//creating hashed url
urlSchema.pre('save', function(){
    // var u = this.original_url;
    // this.hashed_url = shortHash('u');
    this.hashed_url = `sh-${this._id.toString().slice(5,9)}`;
    // console.log(useragent.getBrowser());
});

//creating click info
// urlSchema.post('save', function(){
//     this.info.clicked_date = `${new Date().toString()}`;
//     this.info.ip_address = ip.address();
// });


const Url = mongoose.model('url', urlSchema);

module.exports = {
    Url
};


// var sh = require("shorthash")
// this.hashed_url = sh.unique("u")