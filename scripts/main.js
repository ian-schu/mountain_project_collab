// Helpers
function getByID(id) {
	return document.getElementById(id);
}

// Form submission
function submitForm() {
	let formData = new FormData(finderForm);
	fetch(`http://jsonplaceholder.typicode.com/posts/1`, {
		method: 'GET',
		mode: 'cors',
		// body: formData,
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
		.then(response => {
			if (response.length) {
				return response.json();
			} else {
				return 'no content';
			}
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
