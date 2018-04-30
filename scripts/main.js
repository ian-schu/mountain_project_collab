////////////////////////
// HELPERS
////////////////////////
function getByID(id) {
	return document.getElementById(id);
}

////////////////////////
// DOM NODES
////////////////////////
let finderForm = getByID('route-finder-form');
let submit = getByID('submit-button');
let resultsTable = getByID('the_results');
let resultsHeading = getByID('the_results_heading');

////////////////////////
// FORM SUBMIT FUNCTION:
////////////////////////
function getRoutes() {
	// let formData = new FormData(finderForm);
	// let testPayload = { message: 'hi mom' };
	// let data = new FormData();
	// data.append('json', JSON.stringify(testPayload));
	submitIsLoading();
	resultsHeadingIsLoading();
	clearRoutes();

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
			return response.json();
		})
		.then(output => {
			return output.top_10;
		})
		.then(routes => {
			loadRoutes(routes);
			submitIsReady();
			resultsHeadingIsReady();
		});
}

////////////////////////
// DOM UPDATE FUNCTIONS
////////////////////////

function clearRoutes() {
	resultsTable.innerHTML = '';
}

function loadRoutes(routes_array) {
	for (let route of routes_array) {
		let row = document.createElement('tr');
		row.innerHTML = `
    <td><a target="_blank" href="https://www.mountainproject.com/route/${route.route_id}">${
			route.route_name
		}</a></td>
    <td>${route.route_grade}</td>
    <td>${route.number_pitches}</td>
    <td>${route.keywords.join(`, `)}</td>
    `;
		resultsTable.appendChild(row);
	}
}

function submitIsLoading() {
	submit.classList.toggle('route-finder__submit--loading');
	submit.innerText = 'Loading ...';
}

function submitIsReady() {
	submit.classList.toggle('route-finder__submit--loading');
	submit.innerText = 'Get Routes';
}

function resultsHeadingIsLoading() {
	resultsHeading.innerText = 'Loading ...';
}

function resultsHeadingIsReady() {
	resultsHeading.innerText = 'Recommended Routes';
}

////////////////////////
// SUBMIT LISTENER: //
////////////////////////
submit.addEventListener('click', ev => {
	if (finderForm.checkValidity()) {
		ev.preventDefault();
		getRoutes();
	} else {
		submit.click();
	}
});
