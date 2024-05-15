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
        res.redirect('/products');

        //await userModel.create(req.body);
        //delete user.password;
        //req.session.user = user;
    } catch (error) {
        res.redirect('/register');
    }
    
});

router.post("/login", async (req, res) =>{
    try {
        req.session.failLogin = false;
        //const { email, password } = req.body;
        const user = await userModel.findOne({ email: req.body.email });//Busco el usuario con email: email

        if(!user){
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if(user.password != req.body.password){
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        //delete user.password;
        req.session.user = user;
        return res.redirect("/api/products");
    } catch (error) {
        req.session.failLogin = true;
        res.redirect("/login");
    }
    
});

router.get('/logout', async (req, res) =>{
    try {
        req.session.destroy( error =>{
            if(!error)
                return res.send('Logout success!');
            res.send({
                status:'Logout ERROR',
                body: error
            });
        });

    } catch (error) {
        res.status(500).send('Internal server error.');
    }
    
});

export default router;