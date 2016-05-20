var mongodb = require('./mongodb');

var hintSchema = new mongodb.mongoose.Schema({
    senderId: String,
    targetId: String
});
var hintModel = mongodb.mongoose.model('Hint', hintSchema);//数据库模型

function Hint(hint) {
    this.targetId = hint.targetId;//属性
    this.senderId = hint.senderId;
};//this后面的name与数据库相关，hint后面的name与ejs中的name相关

Hint.prototype.save = function (callback) {
    var hint = {
    	senderId: this.senderId,
        targetId: this.targetId
    }
    var newHint = new hintModel(hint);

    newHint.save(function (err, hint) {
        if (err) {
            return callback(err);
        }
        callback(null, hint);
    });
}//保存
Hint.get = function (targetId, callback) {
    hintModel.findOne({targetId: targetId}, function (err, hint) {
        if (err) {
            return callback(err);
        }
        callback(null, hint);
        
    });
}//查询登陆用户
Hint.friend = function (senderId,callback){
	hintModel.find({senderId: senderId},function(err,hint){
		 if (err) {
            return callback(err);
        }
        callback(null, hint);
	})
}
module.exports = Hint;