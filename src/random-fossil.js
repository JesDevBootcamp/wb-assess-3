import axios from "axios";

// Display a random fossil on button click:
const randomButton = document.getElementById('get-random-fossil');
randomButton.addEventListener('click', async (event) => {
	// Await the fossil data:
	let fossil = await axios.get('/random-fossil.json');
	fossil = fossil.data;

	// Display fossil image:
	let image = document.getElementById('random-fossil-image');
	image.innerHTML = `<img src="${fossil.img}" alt="${fossil.name}" />`;

	// Display fossil name:
	let name = document.getElementById('random-fossil-name');
	name.innerText = fossil.name;
});