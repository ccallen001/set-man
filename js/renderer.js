'use strict';

// ---------------------------------------------------------------------------------------------------------------------

// FIREBASE
// initialize database and vars, get/set data, render view

const database = firebase.database().ref();

database.once('value', d => {
	data.songs = d.val() || [];

	// gets greatest songId value and sets it as starting point for adding new ids
	id = data.songs.map(song => Number(song.id)).sort().pop() || 0;

	calctotalSetTime();

	renderSongs();
});

// ---------------------------------------------------------------------------------------------------------------------

// DATA

// initialize the data object
var data = {
	songs: [], // gets populated by the Firebase call
	leads: ['bobbie', 'jack', 'tom'],
	genres: ['pop', 'rock', 'country'],
	totalSetTime: 0
};

// variables
var age, duration, genre, id, lead, title;


// ---------------------------------------------------------------------------------------------------------------------

// DOM

const [titleInp, leadInp, genreInp, ageInp, durationInp] = document.querySelectorAll('.ui input'),
	songListDisp = document.querySelector('.songs'),
	addBtn = document.querySelector('button.add'),
	totalSetTimeDisp = document.querySelector('.total-time');

// ---------------------------------------------------------------------------------------------------------------------

// CONTROLLERS

// add
function addSong() {
	title = titleInp.value || null;
	lead = leadInp.value || null;
	genre = genreInp.value || null;
	age = ageInp.value || null;
	duration = durationInp.value || null;

	// Where songs are built...
	// -------------------------

	data.songs.push({
		id: ++id,
		title: title,
		lead: lead,
		genre: genre,
		age: age,
		duration: duration
	});

	// -------------------------

	[titleInp, durationInp].forEach(input => input.value = null);
	titleInp.focus();

	renderSongs();
}
addBtn.addEventListener('click', addSong);

// remove
function removeSong() {
	data.songs = data.songs.filter(song => {
		return song.id !== Number(this.parentElement.dataset.songId);
	});

	renderSongs();
}

// calculate total time
function calctotalSetTime() {
	data.totalSetTime = data.songs.reduce((a, b) => {
		b = b.duration.split(':');
		b = ((Number(b[0]) * 60) || 0) + (Number(b[1]) || 0);

		return a + b;
	}, 0);
}

// ---------------------------------------------------------------------------------------------------------------------

// RENDER FUNCTION

function renderSongs() {
	// send to database
	database.set(data.songs.length > 0 ? data.songs : null);

	if (data.songs.map)
		songListDisp.innerHTML = data.songs
			.map(song => `
				<div class="song" data-song-id="${song.id}">
					<span
						class="remove"
						style="
							font-weight: bold;
							cursor: pointer;
						"
					>
						(X)
					</span>
					<div class="inline-block">${song.title} - ${song.duration}</div>
				</div>
			`)
			.join('');

	document.querySelectorAll('.remove').forEach(remove => remove.addEventListener('click', removeSong.bind(remove)));

	calctotalSetTime();
	totalSetTimeDisp.textContent = data.totalSetTime;
}