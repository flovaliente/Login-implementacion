import { Router } from 'express';
//import userModel from '../dao/models/userModel.js';
import UserManagerDB from '../dao/UserManagerDB.js';
import CartManagerDB from '../dao/CartManagerDB.js';
import { userModel } from '../dao/models/userModel.js';

const router = Router();
const userManager = new UserManagerDB();
const cartManager = new CartManagerDB();

router.post('/register', async (req, res) =>{
    try {
        const user = req.body;
        const result = await userManager.registerUser(user);
        const cart = await cartManager.createCart();
        await userManager.createUserCart(result._id, cart._id);
        return res.redirect("/login");

        //await userModel.create(req.body);
        //delete user.password;
        //req.session.user = user;
    } catch (error) {
        res.redirect('/register');
    }
    
});

router.post("/login", async (req, res) =>{
   const { email, password } = req.body; 
   try {
        req.session.failLogin = false;
        
        const user = await userManager.findUserByEmail(email)//Busco el usuario con email: email
        //console.log(user);
        //console.log(email);
        if(!user){
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if(user.password != password){
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        //delete user.password;
        req.session.user = user;
        return res.redirect("/products");
    } catch (error) {
        req.session.failLogin = true;
        res.redirect("/login");
    }
    
});

router.get('/logout', async (req, res) =>{
    req.session.destroy( error =>{
        res.redirect("/login");
    });
});

export default router;