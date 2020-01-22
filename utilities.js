const tipoul    = require("./models/tipoul");
const picture   = require('./models/picture');
const article   = require('./models/article');
const userModel = require('./models/user');
const mongoose  = require('mongoose');
const multer    = require('multer');

// STORAGE FUNCTION WHEN A FILE IS UPLOADED
const storage = multer.diskStorage({

	  destination:  (req, file, cb) => {

	    cb(null, 'images');

	  },
	  filename:  (req, file, cb) => {


		cb(null, file.originalname);

	  }
});
 
const upload = multer({ storage: storage });

// TO FIND ALL THE ITEMS IN MONGODB COLLECTION
const findCollection = async (nameOfTheCollection, jsonToFind, populateName) =>{

	let response;

	try{

		if(populateName === undefined){

	        response = await nameOfTheCollection.find(jsonToFind);
	        return response;
	        
		} else {

			response = await nameOfTheCollection.find(jsonToFind).populate(populateName).exec();
			return response;

		}

	} catch(err){

		console.log(err);
		return err;
	}

};

// TO CREATE AN ITEM IN MONGDB COLLECTION
const createItem = async (nameOfTheCollection, jsonToCreate) =>{

	let response;

	try{
	        response = await nameOfTheCollection.create(jsonToCreate);
	        return response;

	} catch(err){

		console.log(err);
		return err;

	}

};

//TO FIND A SPECIFIC ITEM IN MONGODB COLLECTION
const findItemById = async (nameOfTheCollection, itemId, populateName) =>{

	let response;	

	try{

		if(populateName === undefined){

	        response = await nameOfTheCollection.findById(itemId);
	        return response;
	        
		} else {

			response = await nameOfTheCollection.findById(itemId).populate(populateName).exec();
			return response;

		}
	} catch(err){

		console.log(err);
		return err;

	}

};

//TO FIND A SPECIFIC ITEM AND UPDATE IN MONGODB COLLECTION
const findItemByIdAndUpdate = async (nameOfTheCollection, itemId, Update, populateName) =>{

	let response;	

	try{

		if(populateName === undefined){

	        response = await nameOfTheCollection.findByIdAndUpdate(itemId, Update);
	        return response;
	        
		} else {

			response = await nameOfTheCollection.findByIdAndUpdate(itemId, Update).populate(populateName).exec();
			return response;

		}
	} catch(err){

		console.log(err);
		return err;

	}

};

//TO FIND A SPECIFIC ITEM AND REMOVE IN MONGODB COLLECTION
const findItemByIdAndRemove = async (nameOfTheCollection, itemId, modelePopulate, populateName) =>{

	let response={
		regulare: "",
		populate: ""
	};

	let item = await findItemById(nameOfTheCollection, itemId, populateName);
	let populate = 	item.image;

	try{

		if(populateName === undefined){

	        response.regulare = await nameOfTheCollection.findByIdAndRemove(itemId);
	        return response;
	        
		} else {

			response.populate =await modelePopulate.findByIdAndRemove(populate._id);
			response.regulare = await nameOfTheCollection.findByIdAndRemove(itemId);
			
			return response;

		}

	} catch(err){

		return err;

	}

};

//MIDLEWARD TO CHECK IF IT'S ADMIN
const AdminisLoggedIn = (req, res, next) => {

   if(req.isAuthenticated() && req.user.username === 'admin') {
    
        next();
        return true;       

        } else if(req.isAuthenticated() && req.user.username !== 'admin'){
        	
        	return res.redirect('/home');

        }	else {
           
	           	return res.redirect('/admin');

    		}
};

//MIDLEWARD TO CHECK IF SOME USER IS ONLINE
const isLoggedIn = (req, res, next) => {

   if(req.isAuthenticated() && req.user.username !== 'admin') {

        return next();         

        } else if(req.isAuthenticated() && req.user.username === 'admin'){
        	
        	return res.redirect('/home');

        }	else {

   	            return res.redirect('/admin');
   	            
        	}
};

// TO CHECK IF ADMIN LOGIN TO DISPLAY SOMETHINK THAT JUST ADMIN IS AUTHORIZE TO SEE
const checkIfAdminForClientSide = (req) => {

	if(req.isAuthenticated() && req.user.username === 'admin') {

	        return true;

	    } else {

	        	return false;

	        }
};

// TO CHECK IF USER IF ONLINE TO DISPLAY SOMETHING LINK LOGOUT BUTTON
const checkIfOnlineForClientSide = (req) => {

	if(req.isAuthenticated()) {

	        return true;
	    } else {

		        return false;

	        }
};

//TO CHECK IF EMAIL ALREADY EXIST IN DATABASE
const findEmail = async (data) => {

    try{

        let emailFinded = await userModel.findOne({email: data});
        return emailFinded;

    } catch (err){

    	return err;

    }
};

//TO CHECK IF USER EXIST IN DATABASE
const findUser = async (data) => {
    try{

        let userFinded = await userModel.findOne({username: data});
        return userFinded;

    } catch (err){

        return err;

    }
};

//FINAL FONCTION TO CHECK IF USER ALREADY EXIST
const  findIfExist = async (users, mails) => {
	let message;
	let response = {

		message: "",
		value: false
	};

    try{

        let toFindEmail = await findEmail(mails);
        let toFindUser = await findUser(users);

        if(toFindEmail !== null){

            response.message = 'Email already exist';
            response.value = true;
            return response;

        } else {

            if(toFindUser !== null){

                response.message = 'User already exist';
                response.value = true;
            	return response;

            } else {

                return response;                   

            }
        }
    } catch{

        return err;

    }
};

//TO REGISTER AN USER
const registrationUser = async (usernames,emails,passwords) => {

    try{

    let userregistration = await  userModel.register(new userModel({username: usernames, email: emails}), passwords);
    return userregistration;

    } catch(err){

        return err;

    }
};

exports.findCollection             = findCollection;
exports.AdminisLoggedIn            = AdminisLoggedIn;
exports.isLoggedIn                 = isLoggedIn;
exports.checkIfAdminForClientSide  = checkIfAdminForClientSide;
exports.checkIfOnlineForClientSide = checkIfOnlineForClientSide;
exports.createItem                 = createItem;
exports.findItemById               = findItemById;
exports.findItemByIdAndUpdate      = findItemByIdAndUpdate;
exports.findItemByIdAndRemove      = findItemByIdAndRemove;
exports.findEmail                  = findEmail;
exports.findUser                   = findUser;
exports.findIfExist                = findIfExist;
exports.registrationUser           = registrationUser;
exports.storage                    = storage;
exports.upload                     = upload;

