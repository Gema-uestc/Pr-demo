var mongodb = require('./mongodb');

var userSchema = new mongodb.mongoose.Schema({
    name: String,
    password: String,
    saying: String,
    following_id: Array


});
var userModel = mongodb.mongoose.model('User', userSchema);//数据库模型

function User(user) {
    this.name = user.name;//属性
    this.password = user.password;
    this.saying= user.saying;
    this.following_id=user.following_id;
    
};//this后面的name与数据库相关，user后面的name与ejs中的name相关

User.prototype.save = function (callback) {
    var user = {
        name: this.name,
        password: this.password,
        saying: this.saying,
        followingId: this.following_id,
    }
    var newUser = new userModel(user);

    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}//保存

User.get = function (name, callback) {
    userModel.findOne({name: name}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
        
    });
}//查询登陆用户

User.get_lots = function (name, callback) {
    userModel.find({}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
        //console.log(user);
    });
}//查询所有用户

User.saying = function (saying, callback) {
    userModel.distinct("_id", function (err, user) {
        if (err) {
            return callback(err);
        }
        //onsole.log(user);
        callback(null, user);
    });
}//查询所有用户

User.friend =function(id,following_id,callback){
    userModel.update({_id:id},{$push:{following_id:following_id}},function(err, user){
        if (err) {
            return callback(err);
        }
        //onsole.log(user);
        callback(null, user);
    });
}


// User.following = function(targetId,callback){
//     userModel.findById(senderId, function(err, ){
//         if (err) {
//             return handleError(err)
//         }
//         var followed = false 
//         for (var i = user.followingId.length - 1; i >= 0; i--) {
//             if user.followingId[i] == targetId {
//                 followed = true
//                 break
//             }
//         }
//         if (followed) {
//             return callback(followed)
//         }
//         user.followingId.push(targetId)
//         user.save(function(err){
//             if (err) {
//                 return handleError(err)
//             }
//         })
//         callback(null, followed)
//     })
// }

module.exports = User;