
// This function returns the shape of a circle with a given radius
// returns an array containing the width of each layer
var getShape = function (radius) {
  var x = radius;
  var y = 0;
  var radiusError = 1 - x;
  
  var widths = Array(radius+1);
  
  while (x >= y) {
    
    widths[x+radius] = y*2+1;
    widths[y+radius] = x*2+1;
    widths[radius-x] = y*2+1;
    widths[radius-y] = x*2+1;
	
    y++;
    
    if (radiusError < 0) {
        radiusError += 2 * y + 1;
    }
    else {
        x--;
        radiusError+= 2 * (y - x + 1);
    }
  }
  
  return widths;
};

// This function returns the amount of pixels on the circumference
// of a circle with a given radius
var getCirumference = function(radius) {
	// This would be the circumference of a circle...
	//var circumference = 4 * Math.floor(Math.sqrt(2) * radius);
	//return circumference;
	
	// ... but our planet is flat... so it's just twice the width. (front side and back side)
	return 2*radius;
};

var rgbToString = function(rgb){
	var r = rgb[0],
		g = rgb[1],
		b = rgb[2];
	
	var str = 'rgb(' + Math.min(255, r) + ',' + Math.min(255, g) + ',' + Math.min(255, b) + ')';

	return str;
};

var changeLuminance = function(rgb, percent){
	var r = rgb[0],
		g = rgb[1],
		b = rgb[2];
		
	percent = percent / 100;
	
	r = Math.max(0, Math.min(255, r + (256 * percent)));
	g = Math.max(0, Math.min(255, g + (256 * percent)));
	b = Math.max(0, Math.min(255, b + (256 * percent)));
	
	return [r,g,b];
};

var drawPlanet = function(){
	for (var slice = 0; slice < planet.length; slice++) {
		for (var pos = 0; pos < shape[slice]; pos++) {
			var sliceoffset = Math.floor(rotation * planet[slice].length);
			
			var color = planet[slice][(pos + sliceoffset) % planet[slice].length];
			var y = slice;
			var x = pos - (shape[slice]-1)/2;
			drawVoxel(x,y,color);
		}
	}
};

var addShade = function(x, y, rgb){
	

	// sun lights half of the planet -> offset shade a quarter of the plantets circumference to left an right
	var shadeOffsetFromCenter = Math.floor(planet[y].length / 4 );
	// the pixel where the center of the light is 
	var lightCenterX = Math.floor(SUNPOS[0] * planet[y].length / 4);
	
	// calculate the distance between x and the center of light;
	// make sure p1 <= p2
	p1 = Math.min(x, lightCenterX);
	p2 = Math.max(x, lightCenterX);
	// direct distance between the 2 points
	dist1 = p2 - p1;
	// distance when overflowing the end of the array
	dist2 = p1 + planet[y].length - p2
	// actual distance in x direction
	distToCenterX = Math.min(dist1, dist2);
	
	lightCenterY = Math.floor(SUNPOS[1] * SIZE + SIZE);
	distToCenterY = Math.abs(y - lightCenterY);
	
	totalDist = Math.round(Math.sqrt(Math.pow(distToCenterX,2), Math.pow(distToCenterY,2)));
	
	if(totalDist > Math.abs(shadeOffsetFromCenter)){
		rgb = changeLuminance(rgb, -totalDist/(planet[y].length/2) * 130);
	}else{
		rgb = changeLuminance(rgb, 0.5 - (totalDist/(planet[y].length/2)) * 50);
	}
	
	return rgb;
	
};

var drawVoxel = function(x, y, rgb){
	
	var VOXELSIZE = 4;
	var OFFSETX = 400;
	var OFFSETY = 200;
	
	rgb = addShade(x, y, rgb);
	
	ctx.fillStyle = rgbToString(rgb);
	ctx.fillRect(x*VOXELSIZE + OFFSETX, y*VOXELSIZE + OFFSETY, VOXELSIZE, VOXELSIZE);
};

var moveSun = function(){
SUNPOS[0] = SUNPOS[0] + 0.005;
	
	if (SUNPOS[0] > 2){
		SUNPOS[0] = -2;
	}
};

