import { Router } from 'express';
import ProductManagerDB from '../dao/ProductManagerDB.js';
import productModel from '../dao/models/productModel.js';
import CartManagerDB from '../dao/CartManagerDB.js';
import { auth } from '../middlewares/auth.js';
import cartModel from '../dao/models/cartModel.js';


const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.render("welcome", { title: "Welcome | Valsaa", style: "home.css" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

router.get('/register', async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect("/products");
    }
    res.render("register", {
      title: "Register",
      style: "login.css",
      failRegister: req.session.failRegister ?? false,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

router.get('/products', async (req, res) => {
  try {
    const user = req.session.user;
    let { limit = 5, page = 1 } = req.query;
    //let products = await productManager.getProducts(limit, page);
    let products = await productModel.find();
    products = products.map((p) => p.toJSON());
    res.render("products", { title: "Products w paginate", products, user, style: "product.css" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

router.get('/cart', async (req, res) =>{
  try {
    const cid = req.params.cid;
    const cart = await cartModel.findById(cid).populate("products.productId").lean();
    //let cart = await cartManager.getCartById(cid, true);
    console.log(cart);
    res.render("cart", { title: "Cart view", cart, style: "cart.css" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    let products = await productModel.find();
    products = products.map((p) => p.toJSON());
    res.render("home", { title: "RealTime-Products ", style: "RTP.css", products });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

router.get('/login', async (req, res) => {
  try {
    res.render("login", {
        title: "Valsaa | Login",
        style: "login.css",
        failLogin: req.session.failLogin ?? false,
      });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
});

export default router;