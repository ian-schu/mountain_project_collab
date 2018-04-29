// Helpers
function getByID(id) {
	return document.getElementById(id);
}

// Form submission
function submitForm() {
	let formData = new FormData(finderForm);
	fetch(`http://18.221.10.29`, {
		method: 'POST',
		mode: 'cors',
		body: formData,
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
		.then(response => {
			return response.json();
		})
		.then(output => {
			console.log(output);
		});
}

// DOM nodes
let finderForm = getByID('route-finder-form');
let submit = getByID('submit-button');

// Listeners
submit.addEventListener('click', () => {
	event.preventDefault();

	submitForm();
});
