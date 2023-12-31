import express from 'express';
import session from 'express-session';
import lodash from 'lodash';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import ViteExpress from 'vite-express';

const app = express();
const port = '8000';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

const MOST_LIKED_FOSSILS = {
  aust: {
    img: '/img/australopith.png',
    name: 'Australopithecus',
    num_likes: 584,
  },
  quetz: {
    img: '/img/quetzal_torso.png',
    name: 'Quetzal',
    num_likes: 587,
  },
  steg: {
    img: '/img/stego_skull.png',
    name: 'Stegosaurus',
    num_likes: 598,
  },
  trex: {
    img: '/img/trex_skull.png',
    name: 'Tyrannosaurus Rex',
    num_likes: 601,
  },
};

const OTHER_FOSSILS = [
  {
    img: '/img/ammonite.png',
    name: 'Ammonite',
  },
  {
    img: '/img/mammoth_skull.png',
    name: 'Mammoth',
  },
  {
    img: '/img/ophthalmo_skull.png',
    name: 'Opthalmosaurus',
  },
  {
    img: '/img/tricera_skull.png',
    name: 'Triceratops',
  },
];

// Render the Homepage route:
app.get('/', (req, res) => {
	// Redirect to /top-fossils if username:
	if (req.session.userName) {
		res.redirect('/top-fossils');
	}
	// Else, render the Homepage:
	else {
		res.render('homepage.html.njk');
	}
});

// Save the user's name in the current session:
// Redirect to /top-fossils:
app.get('/get-name', (req, res) => {
	req.session.userName = req.query.name;
	res.redirect('/top-fossils');
});

// Render the Top Fossils page, sending data to it:
app.get('/top-fossils', (req, res) => {
	// Render only if username:
	if (req.session.userName) {
		res.render('top-fossils.html.njk', {
			userName: req.session.userName,
			fossils: MOST_LIKED_FOSSILS
		});
	}
	// Else redirect to Homepage:
	else {
		res.redirect('/');
	}
});

// Process liked fossil POST request:
app.post('/like-fossil', (req, res) => {
	// Get the key of the liked fossil:
	let likedFossil = req.body.likedFossil;
	// Increment if fossil exists:
	if (likedFossil) {
		// Increment number of likes by one:
		MOST_LIKED_FOSSILS[likedFossil].num_likes += 1;
		// Render "Thank You" page:
		res.render('thank-you.html.njk', {
			userName: req.session.userName
		});
	}
	// Else redirect to /top-fossils:
	else {
		res.redirect('/top-fossils');
	}
});

app.get('/random-fossil.json', (req, res) => {
  const randomFossil = lodash.sample(OTHER_FOSSILS);
  res.json(randomFossil);
});

ViteExpress.listen(app, port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
