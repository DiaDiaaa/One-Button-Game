// The title of the game to be displayed on the title screen
title  =  "Green Light!!!";

// The description, which is also displayed on the title screen
description  =  `Speed!!!
Click on green light,
Sneak through yellow,
Hold on red light.
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
* }} enemy
*/
/**
* @type { enemy[] }
*/
let enemy=[];

let click_count = 0;
let current_type;

let gameTime = 3000;
function drawTime(time, x, y) {
    let t = Math.floor((time * 100) / 50);
    if (t >= 10 * 60 * 100) {
        t = 10 * 60 * 100 - 1;
    }
    const ts =
        getPaddedNumber(Math.floor(t / 6000), 1) +
        "'" +
        getPaddedNumber(Math.floor((t % 6000) / 100), 2) +
        '"' +
        getPaddedNumber(Math.floor(t % 100), 2);
	color("red")
    text(ts, x, y);
}
function getPaddedNumber(v, digit) {
    return ("0000" + v).slice(-digit);
}
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
	if(gameTime <= 0){
		end();
	}
	gameTime--;
	drawTime(gameTime,3,10);
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
	if(player.rad < 50) player.rad += 0.25;
	color("cyan")
	arc(player.pos, player.rad);
	const rnd_rad = rnd(G.RADIUS_MIN,G.RADIUS_MAX);
	const rnd_type = rndi(0, 3);
		if(enemy.length < 1){
			for(let i = 0; i < 1; i++){
				enemy.push({
					pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
					rad: rnd_rad,
					type: rnd_type,
				});
			}
	}
	remove(enemy,(e)=>{
		if(e.type == 2){
			color("green");
		}else if(e.type == 1 && player.rad < e.rad*0.75){
			color("yellow");
		}else{
			color("red");
		}
		arc(e.pos,e.rad);
		if(input.isJustPressed){
			if(e.type == 2 && player.rad < e.rad){
				play("coin");
				addScore(20);
			}
			if(e.type == 1 && player.rad < e.rad*0.75){
				play("hit");
				addScore(5);
			}else if(e.type ==1){
				play("explosion");
				addScore(-10);
			}
			if(e.type == 0){
				play("explosion");
				addScore(-20);
			}
		}
		return(e.rad < player.rad)
	});
	if(enemy.length == 0){
		player.rad = 0;
	}
}