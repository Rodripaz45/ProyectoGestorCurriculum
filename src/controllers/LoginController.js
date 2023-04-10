const bcrypt = require('bcrypt');

function login(req, res){
    if(req.session.loggedin != true){
        res.render('login/index');
    }else{
        res.redirect('/curriculum');
    }
}

function auth(req, res){
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) =>{
            if(userdata.length > 0){
                userdata.forEach(element => {
                    bcrypt.compare(data.password, element.password, (err, isMatch) => {
                        if(!isMatch){          
                            res.render('login/index', {error : "Error: contraseña incorrecta"});
                        }else{
                            req.session.loggedin = true;
                            req.session.name = element.name;
                            
                            res.redirect('/curriculum');
                        }
                    });
                })
            }else{
                res.render('login/index', {error : "Error: usuario no esta registrado!"});
            }
        });
    });
}

function register(req, res){
    if(req.session.loggedin != true){
        res.render('login/register');
    }else{
        res.redirect('/curriculum');
    }    
}

function storeUser(req, res){
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) =>{
            if(userdata.length > 0){
                res.render('login/register', {error : "Error: usuario ya registrado!"});
            }else{
                bcrypt.hash(data.password,12).then(hash => {
                    data.password = hash;
            
                    req.getConnection((err,conn) => {
                        conn.query('INSERT INTO users SET ?', [data], (err, rows)=>{
                            
                            req.session.loggedin = true;
                            req.session.name = data.name;

                            res.redirect('/curriculum');
                        });
                    });
            
                });
            }
        });
    });  
}
function logout(req, res){
    if(req.session.loggedin == true){
        req.session.destroy()
        res.redirect('/')
    }else{
        res.redirect('/login');
    }
}

function loadCurriculum(req, res){
    if(req.session.loggedin == true){
        res.render('login/curriculum');
    }else{
        res.redirect('/');
    }    
}

function saveCurriculum(req, res){
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM curriculum WHERE correo = ?', [data.correo], (err, userdata) =>{
            if(userdata.length > 0){
                res.render('login/curriculum', {error : "Error: usuario ya registrado!"});
            }else{
                req.getConnection((err, conn) =>{
                    conn.query('INSERT INTO curriculum SET ?', [data], (err, rows) =>{
                        
                        
                        
                        res.redirect('/home');
                    });
                });
            }
        });
    });
}

function home(req, res){
    if(req.session.loggedin == true){
        req.getConnection((err, conn) =>{
            conn.query('SELECT * FROM curriculum ', (err, rows) =>{
                res.render('login/home', {datos:rows})
            });
        });
    }else{
        res.redirect('/');
    }    
}

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
    loadCurriculum,
    home,
    saveCurriculum,
}