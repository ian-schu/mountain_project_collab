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
let typeSelect = getByID('type-select');
let minSelect = getByID('min-grade');
let maxSelect = getByID('max-grade');
let locationSelect = getByID('location');

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

function clearOptions(selectNode) {
	selectNode.innerHTML = `
  <option value="" selected>Select one</option>
  `;
}

function populateOptions({ selectNode, optionArray }) {
	for (let optionText of optionArray) {
		let newOption = document.createElement('option');
		newOption.value = optionText;
		newOption.innerText = optionText;
		selectNode.appendChild(newOption);
	}
}

////////////////////////
// LISTENERS: //
////////////////////////
submit.addEventListener('click', ev => {
	if (finderForm.checkValidity()) {
		ev.preventDefault();
		getRoutes();
	} else {
		submit.click();
	}
});

typeSelect.addEventListener('input', ev => {
	if (ev.target.value === 'Boulder') {
		clearOptions(minSelect);
		clearOptions(maxSelect);
		populateOptions({ selectNode: minSelect, optionArray: boulderGrades });
		populateOptions({ selectNode: maxSelect, optionArray: boulderGrades });
	}
	if (ev.target.value === 'Sport' || ev.target.value === 'Trad') {
		clearOptions(minSelect);
		clearOptions(maxSelect);
		populateOptions({ selectNode: minSelect, optionArray: sportGrades });
		populateOptions({ selectNode: maxSelect, optionArray: sportGrades });
	}
});

////////////////////////
// INIT CALLS: //
////////////////////////
populateOptions({ selectNode: locationSelect, optionArray: locations });
