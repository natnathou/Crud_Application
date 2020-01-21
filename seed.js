const mongoose = require('mongoose');
const fs       = require('fs');
const tipoul   = require('./models/tipoul');
const picture  = require('./models/picture');
const article  = require('./models/article');
const User     = require('./models/user');

let Article={
	name: "Les inconvenient de la nature",
	text: "LoremLorem Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat vel dolores a libero, eveniet nam ducimus quibusdam impedit quisquam eos eum odit sapiente minus ipsam placeat facere sed. Reprehenderit, sequi?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam voluptatibus quod illum consequatur, voluptates itaque deserunt, veritatis officiis aliquam, distinctio error dignissimos suscipit temporibus iusto a dolores totam est reiciendis?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat labore minima, alias eaque assumenda quos qui nulla unde debitis magni, praesentium, nostrum reprehenderit veritatis soluta asperiores id eveniet beatae ducimus!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus neque nam voluptatum dignissimos quibusdam quia exercitationem, ab amet, enim corrupti, temporibus maiores totam saepe. Recusandae cupiditate iste sequi doloribus quas?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque ea dolorem molestias aperiam minima saepe laudantium magni minus repellendus, rem a, facilis magnam similique voluptas alias. Nobis molestiae laborum similique.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque facere hic similique quibusdam, harum totam, autem impedit obcaecati optio quae suscipit doloribus mollitia. Nihil, repudiandae eveniet impedit assumenda dolor. Doloribus.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, libero totam error cum explicabo fugit veniam nisi fugiat. Tempora deserunt quam explicabo doloremque voluptatem, accusamus illo quis blanditiis autem unde.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis saepe odit alias officia, error sunt et eum quaerat? Nihil soluta error corporis commodi sunt repellendus quisquam ad nulla praesentium aspernatur?"
};

let arrayImage   =['images/naturopathy.jpg','images/homeopathy.jpg','images/bachflower.jpg'];
let fsArray      =[];
let contentImage = [];
let imageData    =[];
let data         = [
{
name: 'Naturopathie',
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae, doloribus nobis ea. Error aliquam, ut expedita nisi magnam vel. Sunt a officia laboriosam architecto deserunt reprehenderit velit omnis recusandae.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet modi rem corrupti iusto nulla, magni eligendi, et dolorum quaerat nihil culpa error, ullam eaque debitis voluptatem eum! Ipsa, excepturi explicabo.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti, culpa facilis quod officiis molestias in, rem voluptatum quia fugit illum non tenetur veniam ipsum atque architecto temporibus pariatur sed eligendi.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut soluta eligendi corporis harum aperiam dolor vitae, nisi sequi distinctio dolorem accusantium praesentium labore, ab exercitationem molestiae sed voluptatem, saepe ratione.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto enim distinctio nisi. Rem explicabo ducimus dolore iusto, magnam cumque quos, voluptas unde porro asperiores. Tempore nihil sed vero mollitia nam!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, omnis sint, dignissimos harum nam ipsa in iure quis culpa vel expedita iste repellendus rem, voluptates odit quidem laboriosam accusamus perspiciatis.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe illo magnam veritatis odio, esse. Odit magnam, et, officia alias molestiae itaque ea quas perspiciatis quasi libero, iure fugiat dolorem illum.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat reiciendis cum doloribus vel ea suscipit ad molestiae adipisci impedit dignissimos sapiente nihil quisquam deserunt pariatur, animi maiores obcaecati nesciunt veniam?'
},

{
name: 'Homeopatie',
description: 'L’homéopathie ou homœopathie (du grec ὅμοιος / hómoios, « similaire » et πάθος / páthos, « souffrance » ou « maladie ») est une pratique pseudo-scientifique de médecine alternative inventée par Samuel Hahnemann en 1796. La croyance sur laquelle se base l\'homéopathie est celle d\'une possibilité de soigner un patient en diluant très fortement des substances qui, si elles étaient concentrées, provoqueraient des symptômes similaires à ceux qu\'il rencontre. Au-delà d\'un certain nombre de dilutions, les remèdes homéopathiques sont dépourvus de principes actifs1. L\'homéopathie ne constitue pas un traitement plausible, étant donné que les principes sur lesquels la méthode de traitement repose, que ce soit à propos du fonctionnement des médicaments, des maladies, du corps humain, des fluides et des solutions, sont contredits par un large ensemble de découvertes faites en biologie, psychologie, physique et chimie dans les deux siècles suivant son invention'
},

{
name: 'Fleurs de Bach',
description: 'Lorem Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium blanditiis maxime culpa est eius eos ratione quibusdam quas molestias ad in, nisi doloribus tempore qui sint, ipsa! Natus, autem, officiis!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos tenetur, enim alias quis ea ab id ipsa at sunt velit! Nisi debitis quod reprehenderit voluptates soluta ducimus aspernatur eaque perferendis!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam praesentium, temporibus, minima ipsum nisi, quasi minus officiis sit inventore blanditiis numquam tempore architecto ab quos, ratione reiciendis unde vero vitae?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti dicta soluta mollitia impedit a explicabo tempora. Tenetur temporibus architecto, fuga nam error et voluptatum, eius velit eveniet soluta minus quo!un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un de Bach, un nom mélodieux pour désigner des extraits liquides de plantes qui ont un effet positif sur les émotions dites négatives. C’est le Dr Edward Bach, décédé en 1936, qui a donné son nom à cette médecine qu’il découvrit au début du siècle dernier. Depuis plus de 70 ans, ces extraits de fleurs appelés aussi élixirs floraux, ont prouvé leurs bienfaits pour toutes sortes de problèmes émotionnels aussi bien chez les enfants que chez les adultes. Mais que sont réellement ces Fleurs de Bach, comment bien les choisir et surtout comment les utiliser ? Suivez les explications de votre pharmacien conseil pour profiter de tous les bienfaits de ces Fleurs de Bach au quotidien.'
}
];


arrayImage.forEach(function(img){

	fsArray.push(fs.readFileSync(img));

});

arrayImage.forEach(function(img){

	contentImage.push('image/jpg');

});


for(let i=0;i<arrayImage.length;i++){

	let data=fsArray[i], contentType =contentImage[i];
	imageData[i]={contentType ,data};

};


const initialisation = async () => {

		await User.remove({});
		console.log('user removed');
		await article.remove({});
		console.log('article removed');
		await tipoul.remove({});
		console.log('tipoul removed');
		await picture.remove({});
		console.log('picture removed');
		for(let i=0 ; i<data.length ; i++){

			let img = await picture.create(imageData[i]);
			let service = await tipoul.create(data[i]);
			service.image=img;
			await service.save();
			console.log(service);

		};

		let art = await article.create(Article);
		console.log(art);
};

exports.initialisation = initialisation;


	





