const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var port = process.env.PORT || 3000;

// #region ################ CONFIG #################
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var connection = mysql.createConnection({
host: 'mysql746.umbler.com',
user: 'gaming_proplan1',
password:'mustang300gt',
database: 'gaming_proplan',
port: 41890,
ssl: true

});




connection.connect(function(err){
if (err) {
    console.log('error connecting' + err.stack);
    return;
}
console.log('connected as id' + connection.threadId);

});

app.get('/', function (req, res) {

    console.log('Passando no: Entrando no Get/ ');
    res.send('Welcome');

});

//login
app.get('/login/:email/:password', function (req, res) {
console.log('passando no: get/login');

var msg_res = {};
msg_res.status = 200;
msg_res.message = "";

var login_temp = {};
login_temp.nome = req.params.nome;
login_temp.data_nascimento = req.params.data_nascimento;
login_temp.cpf = req.params.cpf;
login_temp.med_ou_est = req.params.med_ou_est;
login_temp.especialidade = req.params.especialidade;
login_temp.crmv_facul = req.params.crmv_facul;

console.log(login_temp);

res.status(msg_res.status).json(msg_res);

    

});




app.post('/register', function(req, res) {

    console.log('Passando no: Entrando no POST/REGISTER');

    var erro = false;

    var msg_res = {};
    msg_res.status = 200;
    msg_res.message = "";

    var register_temp = {};
    register_temp = req.body;

   var status_code = 200;
   var msg_text = '';


        register_insert(register_temp).then((result2) =>{
       
            console.log('Passando no: Register > register_insert.Then() ');
          res.status(msg_res.status).json(msg_res);
     
        })
 
    });
        
       /* .catch((err2) => {
        console.log('Passando no: Register > register_insert.Catch() ');


        msg_res.status = err2.status_code;
        msg_res.message = err2.msg_text;

        console.log('Register INSERT - catch - Erro: ' + msg_res.message);

        res.status(msg_res.status).json(msg_res);

        });
 */
//
    



  //  console.log(login_temp);

  //  res.status(msg_res.status).json(msg_res);
    




//register

function register_insert(register_temp) {
    return new Promise((resolve, reject) =>  { 
       connection.query(`INSERT INTO login (nome, data_nascimento, cpf, med_ou_est, especialidade, crmv_facul) VALUES ('${register_temp.nome}', '${register_temp.data_nascimento}', '${register_temp.cpf}', '${register_temp.med_ou_est}', '${register_temp.especialidade}', '${register_temp.crmv_facul}') `, function(err, results, field){
     
        var obj_err = {};
        obj_err.msg_text = '--->>> register_insert - Não entrou no erro ainda...';

        if(err){
            console.log('Erro: register_insert dentro da PROMISE: ' + err);
            obj_err.status_code = 400;
            obj_err.msg_text = err
            reject(obj_err);
        }else{
            console.log('Dentro da Promise -> Linhas Afetadas: ' + results.length + '   |  ID: ' + results.insertId);
            resolve(results);
        }


       });

});
}

function register_select(register_temp) {
    return new Promise((resolve, reject) =>  { 
       connection.query(`SELECT * FROM login WHERE nome = '${register_temp.nome}' `, function(err, results, field){
     
        var obj_err = {};
        obj_err.msg_text = '--->>> register_select - Não entrou no erro ainda...';

        if(err){
            console.log('Erro: register_select dentro da PROMISE: ' + err);
            obj_err.status_code = 400;
            obj_err.msg_text = err
            reject(obj_err);
        }else{
            console.log('Dentro da Promise -> Linhas Afetadas: ' + results.length + '   |  ID: ' + results.insertId);
            resolve(results);
        }


       });

});
}

app.listen(port, () => {
  
    console.log(`Listering port ${port}`);

});

