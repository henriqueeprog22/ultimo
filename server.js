const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors')

var port = process.env.PORT || 3000;
//app.use(cors());

// #region ################ CONFIG #################
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

var db_config = {
host: 'mysql746.umbler.com',
user: 'gaming_proplan1',
password:'mustang300gt',
database: 'gaming_proplan',
port: 41890,
ssl: true

};

var connection;

function handleDisconnect() {
  
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
  /* connection.connect(function(err) {              // The server is either down
       if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
         setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
      });                                     // process asynchronous requests in the meantime.
    */
      setTimeout(handleDisconnect, 2000);
      // If you're also serving http, display a 503 error.
      connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
          handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
        }
      });
    }
    
    handleDisconnect();
    


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
login_temp.optin = req.params.optin;

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

    if (erro == false){
    register_select(register_temp).then((results) =>  {

      if(result.length > 0){

 console.log('Passando no: Register > register_select.Then() > verifica resultado > 0');
 status_code = 400;
 msg_text = 'Já existe um cadastro para esse CPF!';

msg_res.status = status_code;
msg_res.message = msg_text;

//
res.status(msg_res.status).json(msg_res);

}else{
    register_insert(register_temp).then((result2) => {

     console.log('Passando no: Register > register_insert.Then()');
     msg_res.status = status_code;
     msg_res.message = msg_text;

//
res.status(msg_res.status).json(msg_res);
    
  
    }); 
    
    /*
    .catch((err2) => {
  
      console.log('Passando no: Register > register_insert.Catch() ');

  msg_res.status = err2.status_code;
msg_res.message = err2.msg_text;

console.log('Register INSERT - catch - Erro: ' + msg_res.message);

//
res.status(msg_res.status).json(msg_res);
    });
*/
    }

    }).catch((err) => {
    
    /*
  console.log('Passando no: Register > register_select.Catch() ');
 if(err.status_code){
  msg_res.status = err.status_code;
  msg_res.message = err.msg_text;
 }else{
  msg_res.status = 500;
  msg_res.message = '--->>> Register - register_select - Catch = Erro no Then disparou a Catch...';
 }

console.log('Register Select - catch - erro' + msg_res.message);


   res.status(msg_res.status).json(msg_res);
*/
    });
   
  
  
    }else{
 //   msg_res.status = status_code;
  //  msg_res.message = msg_text;
    
   // res.status(msg_res.status).json(msg_res);
   }

   
 
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
       connection.query(`INSERT INTO login (nome, data_nascimento, cpf, med_ou_est, especialidade, crmv_facul, optin) VALUES ('${register_temp.nome}', '${register_temp.data_nascimento}', '${register_temp.cpf}', '${register_temp.med_ou_est}', '${register_temp.especialidade}', '${register_temp.crmv_facul}', '${register_temp.optin}') `, function(err, results, field){
     
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
       connection.query(`SELECT * FROM login WHERE nome = '${register_temp.cpf}' `, function(err, results, field){
     
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

