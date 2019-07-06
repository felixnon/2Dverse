// radius of the planet
var SIZE = 60;

// Defines the direction of the light.
// X-value: -1 (left)  +1 (right) -2/2 (from behind) 0 (front)
// Y-value: 0 center, 1 top, -1 bottom
var SUNPOS = [-2,0];

// get the canvas element and its context
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// COLORs needed for the planet
var COLOR = {
	water: [150,150,255],
	land:  [150,255,150],
	white: [240,240,240]
}
	
// 2D shape of the planet. - Widths of each layer
var shape = getShape(SIZE);

// Planet array contains the planets texture (front and back)
var planet = Array(shape.length);

// fill the planet with water
for (var slice = 0; slice < planet.length; slice++) {
	planet[slice] = Array(getCirumference(shape[slice]));
	for (var pos = 0; pos < planet[slice].length; pos++){
		planet[slice][pos] = COLOR.water;// COLORs[Math.floor(Math.random() * COLORs.length)];
	}
	//planet[slice][0] = [200,255,200];
}

var rotation = 0.0;

var rotationRate = 1 / planet[SIZE].length;


var generateNextWedge = function(){
	
	for (var slice = 0; slice < planet.length; slice++) {
		
		var sliceoffset = Math.floor((rotation + 0.5) * planet[slice].length); // + shape[slice];
		
		var pos = sliceoffset % planet[slice].length;
		
		// get the color of proceeding neighbors of the current voxel.
		// convert them to string for comparison
		var neighbor        = JSON.stringify(planet[slice][pos-1 % planet[slice].length]);
		var neighbor_up     = JSON.stringify(planet[Math.max(0,slice - 1)][pos-1 % planet[slice].length]);
		var neighbor_bottom = JSON.stringify(planet[Math.min(SIZE*2,slice + 1)][pos-1 % planet[slice].length]);
		
		// get string represantations of the previously defined colors for comparison
		var strWater = JSON.stringify(COLOR.water);
		var strLand  = JSON.stringify(COLOR.land);
		
		
		// rules:alert(neighbor + neighbor_bottom + neighbor_up + strWater);
		if (neighbor == strWater && neighbor_bottom == strWater && neighbor_up == strWater){
			if (Math.random() <= 0.005){
				planet[slice][pos] = COLOR.land;
				planet[Math.max(0,slice - 1)][pos] = COLOR.land;
			}else if (Math.random() <= 0.025){
				planet[slice][pos] = COLOR.land;
				planet[Math.max(0,slice - 1)][pos] = COLOR.land;
				planet[Math.min(SIZE*2,slice + 1)][pos] = COLOR.land;
			}else{
				planet[slice][pos] = COLOR.water;
			}
		}
		
		else if(neighbor == strLand && neighbor_bottom == strLand && neighbor_up == strLand){
			if (Math.random() <= 0.975){
				planet[slice][pos] = COLOR.land;
			}else{
				planet[slice][pos] = COLOR.water;
			}
		}
		
		else if((neighbor == strLand + neighbor_bottom == strLand + neighbor_up == strLand) == 2){
			if (Math.random() <= 0.80){
				planet[slice][pos] = COLOR.land;
			}else{
				planet[slice][pos] = COLOR.water;
			}
		}
		
		else if((neighbor == strLand + neighbor_bottom == strLand + neighbor_up == strLand) == 1){
			if (Math.random() <= 0.33){
				planet[slice][pos] = COLOR.land;
			}else{
				planet[slice][pos] = COLOR.water;
			}
		}	
	}
}


for (i = 0; i < 100; i ++){
	
	rotation = rotation + rotationRate;
  
	generateNextWedge();
	
}

var rotate = function(){
	rotation = rotation + rotationRate;
  
		generateNextWedge();
		moveSun();
		
		drawPlanet();
}

function onKeyPress(event) {
	rotate();
}

window.setInterval(function () {
    if (document.getElementById("auto_rotate").checked){
		rotate();
	}   
}, 30);



drawPlanet();





