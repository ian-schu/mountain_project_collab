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
let pitchSelect = getByID('pitches');
let locationSelect = getByID('location');
let keywordBlock = getByID('keywords');
let resultDescription = getByID('the_results_description');

////////////////////////
// FORM SUBMIT FUNCTIONS:
////////////////////////

function getFormData() {
	let data = {
		user_id: getByID('user_id').value || '123',
		type: typeSelect.value,
		grade_low: minSelect.value,
		grade_high: maxSelect.value,
		number_pitches: getByID('pitches').value,
		location: getByID('location').value,
		keywords: []
	};

	let keywords = document.querySelectorAll('.route-finder__checkbox > input');
	for (let input of keywords) {
		if (input.checked) {
			data.keywords.push(input.value);
		}
	}

	return data;
}

function getRoutes() {
	submitIsLoading();
	resultsHeadingIsLoading();
	clearRoutes();

	fetch(`http://18.216.182.129`, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify(getFormData()),
		headers: new Headers({
			'Content-Type': 'application/json',
			'X-Requested-With': 'XMLHttpRequest'
		})
	})
		.then(response => {
			console.log(`Response was: ${JSON.stringify(response)}`);
			// if (response === 'no routes found') {
			// 	console.log('this is a string');
			// }
			return response.json();
		})
		.then(output => {
			if (output.top_10) {
				let routes = output.top_10;
				loadRoutes(routes);
				submitIsReady();
				resultsHeadingIsReady();
				addResultDescription();
				return output.top_10;
			} else if (output.message === 'no routes found') {
				console.log(output.message);
				resultsHeadingNoRoutesFound();
				clearResultDescription();
				submitIsReady();
			}
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
    <td>${route.keywords}</td>
    <td>${Number.parseFloat(route.estimated_stars).toFixed(1)}</td>
    `;
		resultsTable.appendChild(row);
	}
}

function addResultDescription() {
	let user_id = getByID('user_id').value;
	let type = typeSelect.value;
	let grade_low = minSelect.value;
	let grade_high = maxSelect.value;
	let number_pitches = getByID('pitches').value;
	let location = getByID('location').value;
	resultDescription.innerText = `Showing recommended ${number_pitches} ${type} routes in ${location} between ${grade_low} and ${grade_high}.`;
}

function clearResultDescription() {
	resultDescription.innerText = '';
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
	resultsHeading.classList.remove('results__heading--noroutes');
	resultsHeading.classList.add('results__heading--loading');
	resultsHeading.innerText = 'Loading ...';
}

function resultsHeadingIsReady() {
	resultsHeading.classList.remove('results__heading--noroutes');
	resultsHeading.classList.remove('results__heading--loading');
	resultsHeading.innerText = 'Recommended Routes';
}

function resultsHeadingNoRoutesFound() {
	resultsHeading.classList.add('results__heading--noroutes');
	resultsHeading.innerText = 'Oops! No routes found with that criteria';
}

function clearOptions(selectNode) {
	selectNode.innerHTML = '';
}

function populateOptions({ selectNode, optionArray }) {
	for (let optionText of optionArray) {
		let newOption = document.createElement('option');
		newOption.value = optionText;
		newOption.innerText = optionText;
		selectNode.appendChild(newOption);
	}
}

function populateKeywords({ selectNode, keywordArray }) {
	for (let keyword of keywordArray) {
		let newCheckbox = document.createElement('div');
		newCheckbox.classList.add('route-finder__checkbox');

		let keywordCaps = keyword.split('');
		keywordCaps[0].toUpperCase();
		keywordCaps = keywordCaps.join('');

		newCheckbox.innerHTML = `
    <input type="checkbox" id="${keyword}" name="${keyword}" value="${keyword}">
    <label for="${keyword}">${keywordCaps}</label>
    `;
		selectNode.appendChild(newCheckbox);
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
		clearOptions(pitchSelect);
		populateOptions({ selectNode: pitchSelect, optionArray: boulderPitches });
	}
	if (ev.target.value === 'Sport') {
		clearOptions(minSelect);
		clearOptions(maxSelect);
		populateOptions({ selectNode: minSelect, optionArray: sportGrades });
		populateOptions({ selectNode: maxSelect, optionArray: sportGrades });
	}
	if (ev.target.value === 'Trad') {
		clearOptions(minSelect);
		clearOptions(maxSelect);
		populateOptions({ selectNode: minSelect, optionArray: tradGrades });
		populateOptions({ selectNode: maxSelect, optionArray: tradGrades });
	}
	if (ev.target.value === 'Trad' || ev.target.value === 'Sport') {
		clearOptions(pitchSelect);
		populateOptions({ selectNode: pitchSelect, optionArray: sportPitches });
	}
});

////////////////////////
// INIT CALLS: //
////////////////////////
populateOptions({ selectNode: locationSelect, optionArray: locations });
// populateKeywords({ selectNode: keywordBlock, keywordArray: keywords });
