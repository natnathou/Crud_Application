const express               = require('express');
const fs                    = require('fs');
const mongoose              = require('mongoose');
const tipoul                = require("./models/tipoul");
const picture               = require('./models/picture');
const article               = require('./models/article');
const userModel             = require('./models/user');
const post                  = require('./models/post');
const utilities             = require('./utilities');
const passport              = require('passport');
const bodyParser            = require('body-parser');
const localStrategy         = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const path                  = require('path');
const multer                = require('multer');
const nodemailer            = require('nodemailer');
const methodOverride        = require("method-override");
const app                   = express();
const tel                   = process.env.TEL;
const whatsap               = process.env.WHATSAP;
const facebook              = process.env.Address_Facebook;
const email                 = process.env.User_email;

// // Commande to active to reset database user + service
// const seeddb                = require('./seed');
// seeddb.initialisation();

app.set('view engine', 'ejs');
app.use('/',express.static(__dirname+'/public'));
app.use('/home',express.static(__dirname+'/public'));
app.use('/home/:id',express.static(__dirname+'/public'));
app.use('/article',express.static(__dirname+'/public'));
app.use('/article/:id',express.static(__dirname+'/public'));
app.use('/post',express.static(__dirname+'/public'));
app.use('/post/:id',express.static(__dirname+'/public'));
app.use('/admin',express.static(__dirname+'/public'));
app.use('/register',express.static(__dirname+'/public'));
app.use('/contact',express.static(__dirname+'/public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('express-session')({

	secret: 'Dieu est un',
	resave: false,
	saveUninitialized: false

}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,  useUnifiedTopology:true});
mongoose.set('useFindAndModify', false);

app.get('/', (req, res) => {

	res.redirect('/home');
	
});

app.get('/home', async (req, res) => {

	let titlePage   = "home";
	let Findtipoul  = await utilities.findCollection(tipoul,{},"image");
	console.log(Findtipoul);
	let FindArticle = await utilities.findCollection(article,{});
	console.log(FindArticle);
	res.render('home', {tipoul:Findtipoul, Article:FindArticle, tel:tel, email:email, whatsap:whatsap, facebook:facebook, titlePage:titlePage, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req)});

});

app.post('/home', utilities.upload.single('myfile'), async (req, res) => {

	let photo         = fs.readFileSync(req.file.path);
	let encode_image  = photo.toString('base64');

	let finalImg      = {
		data:  new Buffer(encode_image, 'base64'),
		contentType: req.file.mimetype,
		name: req.file.originalname
	};

	let newService    = {
		name: req.body.title,
		description: req.body.text
	};

	let createPicture = await utilities.createItem(picture,finalImg);
	console.log(createPicture);
	let createTipoul  = await utilities.createItem(tipoul,newService);
	console.log(createTipoul);

	try {

		createTipoul.image=createPicture;
		await createTipoul.save();
		console.log(createTipoul);
		await fs.unlinkSync(req.file.path);
	    console.log('file delete');

	} catch (err){

		console.log(err);

	}

	res.redirect('/home');

});


app.get('/home/new',utilities.AdminisLoggedIn, (req, res) => {

	let titlePage = 'new';
	res.render('new', {titlePage:titlePage, tel:tel, email:email, whatsap:whatsap, facebook:facebook, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req)});

});

app.get('/online',utilities.isLoggedIn,  (req, res) => {

		res.redirect('/home');
		// Dont need online page because, the user dont need to connect

});


app.get('/home/:id', async (req, res) => {

	let findTipoul = await utilities.findItemById(tipoul,req.params.id, "image");
	console.log(findTipoul);

	try{

		let titlePage = findTipoul.name;
		res.render('description', {tipoul:findTipoul, tel:tel, email:email, whatsap:whatsap, facebook:facebook, titlePage:titlePage, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req)});

	} catch (err){

		console.log(err);

	}
});

app.put('/home/:id', utilities.upload.single('myfile'), async (req, res) => {
	console.log(req.file);

	let serviceUpdated = {
	 	name: req.body.title,
		description: req.body.text
	   };

	if(req.file !== undefined){
		let photo               = fs.readFileSync(req.file.path);
		let encode_image        = photo.toString('base64');
		let finalImg            = {
			data:  new Buffer(encode_image, 'base64'),
			contentType: req.file.mimetype,
			name: req.file.originalname
		};
		let tipoulfindbyid      = await utilities.findItemById(tipoul, req.params.id, "image");
		console.log(tipoulfindbyid);

		let image               = tipoulfindbyid.image;
		let findImageAndUpdate  = await utilities.findItemByIdAndUpdate(picture, image._id, finalImg);
		console.log(findImageAndUpdate);

		let findTipoulAndUpdate = await utilities.findItemByIdAndUpdate(tipoul, req.params.id, serviceUpdated, "image");
		console.log(findTipoulAndUpdate);

		await fs.unlinkSync(req.file.path);
	    console.log('file delete');

	} else {

			let findTipoulAndUpdate = await utilities.findItemByIdAndUpdate(tipoul, req.params.id , serviceUpdated, "image");
			console.log(findTipoulAndUpdate);

		}

		res.redirect('/home');

});


app.delete('/home/:id', async (req, res) => {

	let tipoulAndImageRemove = await utilities.findItemByIdAndRemove(tipoul,req.params.id, picture, "image");
	console.log(tipoulAndImageRemove);

	res.redirect('/home');

});

app.get('/home/:id/edit', utilities.AdminisLoggedIn, async (req, res) => {

	let id         = req.params.id;
	let findTipoul = await utilities.findItemById(tipoul, req.params.id, "image");
	console.log(findTipoul);

	try{

		let titlePage = findTipoul.name+ ' edition';
		res.render('edition', {tipoul:findTipoul, tel:tel, email:email, whatsap:whatsap, facebook:facebook, titlePage:titlePage, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req)});

	} catch (err){

		console.log(err);

	}
});


app.get('/article/:id', async (req, res) => {

	let findArticle = await utilities.findItemById(article, req.params.id);
	console.log(findArticle);

	try{

		let titlePage = findArticle.name;
		res.render('article', {Article:findArticle, titlePage:titlePage, tel:tel, email:email, whatsap:whatsap, facebook:facebook, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req)});

	} catch (err){

		console.log(err);

	}
});


app.get('/article/:id/edit', utilities.AdminisLoggedIn, async (req, res) => {

	let id          = req.params.id;
	let findArticle = await utilities.findItemById(article, req.params.id);
	console.log(findArticle);


	try{

		let titlePage = findArticle.name + ' /edition';
		res.render('article_edition', {Article:findArticle, titlePage:titlePage, tel:tel, email:email, whatsap:whatsap, facebook:facebook, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req)});

	} catch (err){

		console.log(err);

	}
});

app.put('/article/:id', async (req, res) => {

	let articleUpdated       = {
		name: req.body.title,
		text: req.body.text
	};

	let findArticleAndUpdate = await article.findByIdAndUpdate(req.params.id , articleUpdated);
	console.log(findArticleAndUpdate);

	res.redirect('/home');

});


app.get('/post', async (req,res) => {

	let titlePage = 'post';
	let FindPost  = await utilities.findCollection(post, {});
	console.log(FindPost);
	res.render('post', {titlePage:titlePage,post:FindPost, tel:tel, email:email, whatsap:whatsap, facebook:facebook, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req),emailResponse:emailResponse});

});

app.post('/post', async (req,res) => {

	let newPost    = {tag: req.body.post};
	let createPost = await utilities.createItem(post, newPost);
	console.log(createPost);

	res.redirect('/post');

});

app.put('/post/:id', async (req,res) => {

	let postId      = req.params.id;
	let postUpdated = {tag: req.body.post};

	let FindPost  = await utilities.findCollection(post, {});
	console.log(FindPost);

	let findPostAndUpdate = await utilities.findItemByIdAndUpdate(post, postId, postUpdated);
	console.log(findPostAndUpdate);

	res.redirect('/post');

});

app.delete('/post/:id', async (req,res) => {

	let postId      = req.params.id;
	let findPost    = await utilities.findItemById(post, req.params.id);
	console.log(findPost);

	let postRemove = await utilities.findItemByIdAndRemove(post, postId);
	console.log(postRemove);

	res.redirect('/post');

});

app.get('/post/new', utilities.AdminisLoggedIn, async (req,res) => {

	let titlePage = 'new post';
	res.render('post_new', {titlePage:titlePage, tel:tel, email:email, whatsap:whatsap, facebook:facebook, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req),emailResponse:emailResponse});

});

app.get('/post/:id/edit',utilities.AdminisLoggedIn, async (req,res) => {

	let titlePage = 'edition post';
	let postId    = req.params.id;
	let findPost  = await utilities.findItemById(post, req.params.id);
	console.log(findPost);

	res.render('post_edition', {titlePage:titlePage,post:findPost, tel:tel, email:email, whatsap:whatsap, facebook:facebook, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req),emailResponse:emailResponse});

});

let emailResponse='';
app.post('/contact', async (req,res) => {

	let contents    = req.body.content;

	let mailOptions = {
		envelope: {
			from: '<' + process.env.User_email + '>', // used as MAIL FROM: address for SMTP
			to: '<' + contents.email + '>,' + '<' + process.env.User_email + '>'// used as RCPT TO: address for SMTP
		},
		from: process.env.User_email,
		to: contents.email,
		bcc: process.env.User_email,
		subject: '[Copie de l\'email envoyé depuis: ' + contents.email + ']: ' + contents.subject,
		text: 'Votre email ci-dessous a bien été réceptionné.\nNous vous répondrons dans les meilleurs délais\n\n*******************************************************\n\n' + contents.body

	};

	let transporter = nodemailer.createTransport({
		service: process.env.Service_email,
		auth: {
			user: process.env.User_email,
			pass: process.env.Pass_email
		}
	});

	transporter.sendMail(mailOptions, function(error, info){

		if (error) {
			emailResponse = error;
			console.log(emailResponse);
			return res.redirect('/contact');

		} else {
			emailResponse = 'Votre email a bien été envoyé.';
			console.log('emailResponse);
			return res.redirect('/contact');
		}
	});

});

app.get('/contact', (req,res) => {

	console.log('dans get ' + emailResponse);
	let titlePage = ' /contact';
	res.render('contact', {titlePage:titlePage, tel:tel, email:email, whatsap:whatsap, facebook:facebook, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req),emailResponse:emailResponse});
	emailResponse='';

});

app.get('/admin', (req,res) => {

	let titlePage='login';
	res.render('login', {titlePage:titlePage, tel:tel, email:email, whatsap:whatsap, facebook:facebook, adminCheck:utilities.checkIfAdminForClientSide(req), tel:tel, email:email, whatsap:whatsap, facebook:facebook, onlineCheck:utilities.checkIfOnlineForClientSide(req)});

});

app.post('/login', passport.authenticate('local', {

		successRedirect: '/home',
		failureRedirect: '/admin'

}), (req,res) => {

});


let placeholderIfUserExist;
app.post('/register', async (req,res) =>{

	let user               = req.body.username;
	let mail               = req.body.email;
	let passwords          = req.body.password;
	let existTest          = await utilities.findIfExist(user, mail);
	placeholderIfUserExist = existTest.message;
	console.log(placeholderIfUserExist);

	if (existTest.value){

		console.log(placeholderIfUserExist);
		res.redirect('/register');

	} else{

		try{

			let regitration = await utilities.registrationUser(user,mail,passwords);
			console.log(regitration);

			passport.authenticate('local')(req,res, () => {

				res.redirect('/online');

			});

	    } catch {

	    	res.redirect('/register');

	    }

	}

});

app.get('/register',(req,res) => {

	let titlePage          ='register';
	res.render('register',{titlePage:titlePage, tel:tel, email:email, whatsap:whatsap, facebook:facebook, placeholderIfUserExist:placeholderIfUserExist,  tel:tel, email:email, whatsap:whatsap, facebook:facebook, adminCheck:utilities.checkIfAdminForClientSide(req), onlineCheck:utilities.checkIfOnlineForClientSide(req)});
	placeholderIfUserExist ='';

});


app.get('/logout', function(req, res){

  req.logout();
  res.redirect('/home');

});

app.listen(process.env.PORT, process.env.IP, function() {

	console.log('server is starting!!!');

});