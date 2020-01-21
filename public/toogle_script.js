const togglecontainer         = document.getElementById('togglecontainer');
const allnavigation           = document.getElementById('allnavigation');
const overlay                 = document.getElementById('overlay');
const navigation_small_screen = document.getElementById('navigation_small_screen');

const agrandissement = (element,originalWidth, maxWidth,stepInPx) => {

		originalWidth+=stepInPx;
		element.style.width=originalWidth+'%';
		if(originalWidth<=maxWidth){
		setTimeout(agrandissement, 1, element, originalWidth, maxWidth,stepInPx);
	}
};

const retressissement = (element,originalWidth,stepInPx) => {

		originalWidth-=stepInPx;
		element.style.width=originalWidth+'%';
		if(originalWidth>=-50){
		setTimeout(retressissement, 40, element, originalWidth, stepInPx);
	}
};

let width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;

togglecontainer.addEventListener('click', e => {

	let widthScreen=width;
	let heightScreen=height;
	let originalWidth=0;
	navigation_small_screen.style.display="block";
	allnavigation.style.display="flex";
	allnavigation.style.justifyContent="space-between";
	allnavigation.style.alignItems="center";
	allnavigation.style.height="100%";

	agrandissement(allnavigation, originalWidth, 100, 2);
	agrandissement(overlay, originalWidth, 60, 2);
	agrandissement(navigation_small_screen, originalWidth,40, 2);

overlay.addEventListener('mouseover', e => {
		allnavigation.style.cursor='url(\'cross.png\'), auto';
		overlay.addEventListener('click', e => {

			let width=100;
			retressissement(allnavigation, width, 20);
			navigation_small_screen.style.display="none";

		});
		overlay.addEventListener('mouseout', e => {

			allnavigation.style.cursor='default';
		
		});
	
	});

});
