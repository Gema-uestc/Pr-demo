
var crypto = require('crypto'),
    User = require('../models/user.js');

    //Friends = require('../models/friends.js');
module.exports = function(app) {
    app.get("/", function (req, res) {
        res.render('index', { title: "主页"});
    });

    app.get("/login", notAuthentication);
    app.get("/login", function (req, res) {
        res.render('login', { title: "用户登录"});
    });

    app.post("/login", notAuthentication);
    app.post("/login", function (req, res) {
        var name = req.body.username,
            password = req.body.password,
            saying = req.body.saying,
            md5 = crypto.createHash('md5'),
            md5_password = md5.update(password).digest('hex');
        if (name == "" || password == "") {
            req.session.error = "请不要留白！";
            return res.redirect('/login');
        }

        User.get(name, function(err, user) {
            if (!user) {
                req.session.error = "用户不存在！";
                return res.redirect('/login')    ;
            }
            //检查密码是否一致
            if (user.password != md5_password) {
                req.session.error = "密码错误！";
                return res.redirect('/login');
            }
            //用户名密码都匹配后，将用户信息存入session
            req.session.user = user;
            req.session.success = "登录成功！";
            res.redirect('/home');
        });
    });//line:2 与user.js相关联 

    app.get("/register", notAuthentication);
    app.get("/register", function (req, res) {
        res.render('register', { title: "用户注册"});
    });
  

    app.post("/register", notAuthentication);
    app.post("/register", function (req, res) {
        var name = req.body.username,
            password = req.body.password,
            repassword = req.body.repassword,
            saying = req.body.saying;
        if (name == "" || password == "" || repassword == "") {
            req.session.error = "请不要留白！";
            return res.render('/register');
        }
        if (password != repassword) {
            req.session.error = "两次密码输入不一样";
            return res.redirect('/register');
        }
        //密码的md5值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest(    'hex');
        var newUser = new User({
            name: name,
            saying: saying,
            password: password
        });
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.session.error = "用户已经存在!";
                return res.redirect('/register');    
            }
            //不存在，则增加新用户
            newUser.save(function (err, user) {
                if (err) {
                    req.session.error = err;
                    return res.redirect('/register');
                }
                req.session.user = user;
                req.session.success = "注册成功！";
                res.redirect('/home');
            });

        });
    });

    app.get("/logout", authentication);
    app.get("/logout", function (req, res) {
        req.session.user = null;
        res.redirect('/');
    });

    app.get("/home", authentication);

    app.get("/home",function(req,res){
        User.get_lots("name",function(err,user){console.log(req.session.user);
            if(req.session.user.following_id){
                user.forEach(function(item,index,array){
                    item["f"] = false;
                    item["ff"] = false;
                    for (var i = req.session.user.following_id.length - 1; i >= 0; i--) {
                        if(req.session.user.following_id[i] == item._id){
                            item["f"] = true;
                            for (var i = item.following_id.length - 1; i >= 0; i--) {
                                if(item.following_id[i] == req.session.user._id){
                                    item["ff"] = true;
                                }
                            }
                        }
                    }
                })
            }
            
            res.render('home',{
                    users: user,
                    title:'home'
                });
        })
    })
    app.post("/follow", function (req, res) {
        User.friend(req.session.user._id,req.body.id,function(err,user){
            User.get(req.session.user.name, function(err, user) {
            req.session.user = user;
            res.redirect('/home');
        });

            
        })
    });


    //这里是权限控制，通过检测session是否存在，对相关页面进行强制重定向
    function authentication (req, res, next) {
        if (!req.session.user) {
            req.session.error = '请登录';
            return res.redirect('/login');
        }
        next();
    }
    function notAuthentication (req, res, next) {
        if (req.session.user) {
            req.session.error = '已登录';
            return res.redirect('/home');
        }
        next();
    }
}