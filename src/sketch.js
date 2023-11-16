// viewport
let DEFAULT_SIZE = 600;
let W = window.innerWidth;
let H = window.innerHeight;
let ASPECT_RATIO = 1 / 1;
let DIM;
let MULTIPLIER;

let traits = window.alba.getMetadata();

const sketch = (p) => {
	p.randomSeed(prng() * 1e15);
	// get p5.js randomSeed and console.log it

	// Compute the canvas size based on the window size and the aspect ratio.
	let width = window.innerWidth;
	let height = width / ASPECT_RATIO;

	DIM = Math.min(width, height);
	MULTIPLIER = DIM / DEFAULT_SIZE;

	// In the Alba renderer, we ignore the window height limitation as the entire canvas is captured.
	// But if we are in a display which is constrained by height, then use the height and compute the width.
	// This ensures we don't overflow the window.
	if (!isRenderer && height > window.innerHeight) {
		height = window.innerHeight;
		width = height * ASPECT_RATIO;
	}

	let elx = 0;
	let ely = 0;
	let xoff = p.random(100000000);
	let yoff = p.random(100000000);
	let rangeA = [1, 3, 5];
	let rangeB = [1, 2, 3];

	let aValue = rangeA[Math.floor(p.random() * rangeA.length)];
	let bValue = rangeB[Math.floor(p.random() * rangeB.length)];

	p.setup = () => {
		p.createCanvas(width, height);
		p.colorMode(p.HSB, 360, 100, 100, 100);
		p.pixelDensity(window.devicePixelRatio);
		p.rectMode(p.CENTER);
		p.background(0, 0, 0);
		p.fill(p.random(0, 255), 50, 100);

		elx = p.width / 2;
		ely = p.height / 2;
	};

	p.draw = () => {
		if (traits.is_moving === 'true') {
			let nx = oct(xoff, yoff, 0.4, 2, 1);
			let ny = oct(yoff, xoff, 0.4, 4, 1);

			/* 	let u = mapValue(un, -0.5, 0.5, -aValue, bValue);
      let v = mapValue(vn, -0.5, 0.5, -bValue, aValue); */

			let iu = mapValue(nx, -0.5, 0.5, -aValue, bValue);
			let iv = mapValue(ny, -0.5, 0.5, -bValue, aValue);
			// limit trailing decimals of iu and iv to 3 using toFixed(3)
			let u = parseFloat(iu.toFixed(3));
			let v = parseFloat(iv.toFixed(3));

			elx += u;
			ely += v;

			xoff += 0.1;
			yoff += 0.1;

			if (elx > p.width + 20) {
				elx = -20;
			}
			if (ely > p.height + 20) {
				ely = -20;
			}
			if (elx < -20) {
				elx = p.width + 20;
			}
			if (ely < -20) {
				ely = p.height + 20;
			}
		}
		if (traits.shape_type === 'ellipse') {
			p.circle(elx, ely, 20 * MULTIPLIER);
		} else if (traits.shape_type === 'rectangle') {
			p.rect(elx, ely, 20 * MULTIPLIER, 20 * MULTIPLIER);
		}
	};
};

new window.p5(sketch);
