// Helpers
function getByID(id) {
	return document.getElementById(id);
}

// Form submission
function submitForm() {
	// let formData = new FormData(finderForm);
	// let testPayload = { message: 'hi mom' };
	// let data = new FormData();
	// data.append('json', JSON.stringify(testPayload));

	fetch(`http://18.221.10.29`, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({ user_id: '12345' }),
		headers: new Headers({
			'Content-Type': 'application/json',
			'X-Requested-With': 'XMLHttpRequest'
		})
	})
		.then(response => {
			console.log(`Response is: ${JSON.stringify(response)}`);
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
submit.addEventListener('click', ev => {
	ev.preventDefault();

	submitForm();
});
