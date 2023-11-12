// The title of the game to be displayed on the title screen
title  =  "BUBBLE BUBBLE";

// The description, which is also displayed on the title screen
description  =  `Drop the beat!
`;

// The array of custom sprites
characters = [
	`
	  y
	 yyy 
	yyyyyy
	  y  
	  y  
	  y  
	  y  
	`
	,
	`
	  y
	  y
	  y
	yyyyyy
	 yyy
	  y
	`
];

// Data Container and change the size
const G = {
	WIDTH: 200,
	HEIGHT: 150,
	STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
	RADIUS_MIN:10,
	RADIUS_MAX:50
};

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	theme: "dark",
	seed: 2,
	isPlayingBgm: true,
	isReplayEnabled: true
};

//Container variable and JSDoc
/**
* @typedef {{
* pos: Vector,
* speed: number
* }} Star
*/

/**
* @type  { Star [] }
*/
let stars;

/**
 * @typedef {{
* pos: Vector,
* rad: number,
* timer: number,
* }} Player
*/

/**
* @type { Player }
*/
let player;

/**
* @typedef {{
* pos: Vector,
* rad: number,
* type: number,
* x: number,
* y: number,
* }} enemy
*/
/**
* @type { enemy[] }
*/
let enemy=[];

let click_count = 0;
// The game loop function// The game loop function
function update() {
    // The init function running at startup
	if (!ticks) {
        // A CrispGameLib function
        // First argument (number): number of times to run the second argument
        // Second argument (function): a function that returns an object. This
        // object is then added to an array. This array will eventually be
        // returned as output of the times() function.
		stars = times(20, () => {
            // Random number generator function
            // rnd( min, max )
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            // An object of type Star with appropriate properties
            return {
	            // Creates a Vector
                pos: vec(posX, posY),
                // More RNG
                speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
            };
        });
		player = {
			pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
			rad: 5,
			timer: 180
		};
	}
	// Update for Star
	stars.forEach((s) => {
		// Move the star downwards
		if(!input.isPressed){
			s.pos.y += s.speed;
		}
		// Bring the star back to top once it's past the bottom of the screen
		if(s.pos.y > G.HEIGHT) s.pos.y = 0;
		// Choose a color to draw
		color("light_yellow");
		// Draw the star as a square of size 1
		// box(s.pos, 1);
		if(input.isPressed){
			color("red")
			if(s.pos.y > G.HEIGHT*0.5){
				char("a",s.pos)
			}else{
				char("b",s.pos)
			}
		}else{
			char("b",s.pos);
		}
	});
	if(player.timer > 0){
		player.timer -= ticks/10000;
	}else{
		end();
	}
	if(player.rad <= 50){
		player.rad += 0.25;
		play("hit");
	}
	if(input.isPressed){
		color("yellow");
		particle(input.pos,10,1,rnd(0,PI),PI);
		particle(input.pos,player.rad*10,player.rad/15);
	}
		color("cyan");
		particle(input.pos,2,1,-PI/2,PI/4);
	const rnd_x= rnd(G.RADIUS_MAX, G.WIDTH-(G.RADIUS_MAX*2))
	const rnd_y = rnd(G.RADIUS_MAX*2, G.HEIGHT-(G.RADIUS_MAX*2))
	const rnd_pos = vec(rnd_x,rnd_y)
	const rnd_rad = rnd(G.RADIUS_MIN,G.RADIUS_MAX);
	const rnd_type = rndi(0,4);
	arc(input.pos, player.rad);
	if(enemy.length < 1){
			for(let i = 0; i < 1; i++){
				enemy.push({
					pos: rnd_pos,
					rad: rnd_rad,
					type: rnd_type,
					x: rnd_x,
					y: rnd_y,
				});
			}
	}
	remove(enemy,(e)=>{
		if(e.type == 1){
			color("red");
			arc(e.pos, e.rad);
		}else if(e.type == 2){
			color("purple");
			arc(e.pos, e.rad);
		}else if(e.type == 3){
			color("green");
			arc(e.pos, e.rad);
		}else{
			color("yellow");
			arc(e.pos, e.rad);
		}
		let earn_point = false;

		// rect(e.x-0.5*e.rad,e.y-0.5*e.rad,e.rad,e.rad)
		if(input.isJustPressed){
			if(e.rad < player.rad){
				if(input.pos.isInRect(e.x-0.5*e.rad,e.y-0.5*e.rad,e.rad,e.rad)){
					play("coin");
					addScore(e.rad);
					earn_point = true;
				}
			}
		}else if(e.rad+5 < player.rad){
			player.rad = 5;
		}
		return earn_point;
	});
	if(enemy.length == 0){
		player.rad = 0;
	}
}