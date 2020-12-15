const jwt=require('jsonwebtoken');
const config=require('../config');
const bcrypt=require("bcryptjs");
class LoginService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async login({username,password}) {
    const userRecord = await this.userModel.findOne({
      where: {username},
    });

  if(!userRecord)
  {
    this.logger.error('User not registered');
    throw new Error("Authnetication failed");//uvati je login controler
  }

  this.logger.info('Checking password');//password je pssword hash u bazi
  const validpassword=await bcrypt.compare(password,userRecord.password);//provlacenje passworda i soli kroz hash funkciju i usporedba s hash vrijednosti iz baze i vrati boolena
  if(validpassword)//VIDI BROJ RUNDI JER JE ON ZAPISAN U HASHU U BAZI 
  {
    this.logger.info('Password correct.Proceed and generate JWT');
    const user={
      username: userRecord.username,
      role: userRecord.role || 'guest'
    }
    const payload={//vratimo user i token odvojeno da user ne mora parsirat i izvlacit iz tokena te podatke
      ...user,
      aud:config.jwt.audience|| 'localhost/api',
      iss:config.jwt.issuer||'localhost@fesb'
    }
    const token=this.generateToken(payload);
    return {user,token};
  }
  this.logger.info('Password verification failed');
  throw new Error('authnetication failed');//neispravna sifra
}
generateToken(payload)
{
    return jwt.sign(payload,config.jwt.secret,{
      expiresIn:config.jwt.expiresIn
    });
}
}

module.exports = LoginService;
