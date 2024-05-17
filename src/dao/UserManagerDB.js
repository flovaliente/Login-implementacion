import { userModel } from "./models/userModel.js";

class UserManagerDB{

    async registerUser(user){
        try {
            if(user.email == 'adminCoder@coder.com' && user.password == 'adminCod3r123'){
                const result = await userModel.create(user);
                result.role = 'admin';
                result.save();
                return result;
            }

            const result = await userModel.create(user);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Registration error.`);
        }
    }

    async createUserCart(uid, cid){
        try {
            const result = await userModel.findByIdAndUpdate(uid, { cart: cid });
            return result;
        } catch (error) {
            console.error(error.message);
        }
    }

    async findUserByEmail(email) {
        try {
          const result = await userModel.findOne({ email: email });
          return result;
        } catch (error) {
          console.error(error);
        }
      }
}

export default UserManagerDB;