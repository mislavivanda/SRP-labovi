const config=require('../config');
const bcrypt=require("bcryptjs");
class UserService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async getAllUsers() {
    try {
      const users = await this.userModel.findAll();
      return users;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async getUser(userDTO) {
    try {
      const user = await this.userModel.findOne({
        // * to include only some attributes use:
        // * attributes: ["username", "id"]
        where: userDTO,
      });
      return user;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async createUser(userDTO) {
    try {
      this.logger.info(`Hashing passwrod for user ${userDTO.username}`);
      //prvjerit jeli username vec zauzet prije pohrane u bazu-> to provjerava validator u user modelu->problem je sto se to tek provjerava kada napravimo usera u bazi pa smo bzvz radili skupu operaciju hashiranja i pohrane u bazu
      const hashedpassword=await bcrypt.hash(
        userDTO.password,
        config.bcrypt.SALT_ROUNDS
      );

      const user = await this.userModel.create({
       ...userDTO,
       password:hashedpassword//ovo overwritea plaintext password u userDTO
      });
      return user;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async updateUser(userDTO) {
    try {
      let user = await this.userModel.findOne({
        where: { id: userDTO.id },
      });

      if (!user) {
        throw new Error(`No user with id ${userDTO.id} found`);
      }
    
      const{id,password,..._userDTO}=userDTO;//izvlacimo password ,id a sve ostalo ce stavit u varijablu _userDTO
      if(password)//ako postoji password hashiraj ga
      {
        const hashedpassword=await bcrypt.hash(
          userDTO.password,
          config.bcrypt.SALT_ROUNDS
        );
        _userDTO.password=hashedpassword;//_userDTO je pomocni objekt
      }
      user = user.update(_userDTO);
      return user;
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }

  async deleteUser(userDTO) {
    try {
      await this.userModel.destroy({ where: userDTO });
    } catch (err) {
      this.logger.error("Error %o", err);
      throw err;
    }
  }
}

module.exports = UserService;
