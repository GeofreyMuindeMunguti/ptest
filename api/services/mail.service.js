const nodemailer = require('nodemailer');
 

 function sendMailToClient(reqParam){
    return new Promise((resolve, reject)=>{

        let options = {
            auth: {
                api_user: 'SainezKimutai', // Sendgrid username
                api_key: 'saineZ@13' // Sendgrid password
            }
        }

        let transporter = nodemailer.createTransport(options);
    
        let email = {
            from: reqParam.sender, 
            to: reqParam.reciever,  
            subject: reqParam.subject,  
            text: reqParam.message
        };
    
        transporter.sendMail(email, function (err, data) {
            !err ? resolve() : reject('Something went wrong');
         });
    
    });
}


function inviteUser(reqParam){
    return new Promise((resolve, reject)=>{

        let options = {
            auth: {
                api_user: 'SainezKimutai', // Sendgrid username
                api_key: 'saineZ@13' // Sendgrid password
            }
        }

        let transporter = nodemailer.createTransport(options);
    
        let email = {
            from: reqParam.sender, 
            to: reqParam.reciever,  
            subject: "Invitation To Imprint ERP",  
            text: 'Hello',
            html: 'You have been invited to Crystal ERP. Please click on the link below to register:<br><br> <button style="margin-left:70px;border:none;padding:7px;border-radius:5px;background-color:teal;color:white;"><a style="color:white;font-size:14px;font-family:verdana" href="http://localhost/register/' + reqParam.reciever + '/' + reqParam.token + '">Invitation</a></button>'
        };
    
        transporter.sendMail(email, function (err, data) {
            !err ? resolve() : reject('Something went wrong');
         });
    

    });
}



 module.exports = { sendMailToClient, inviteUser }
