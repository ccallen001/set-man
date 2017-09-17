'use strict';

// ---------------------------------------------------------------------------------------------------------------------

// FIREBASE
// initialize database and vars, get/set data, render view

const database = firebase.database().ref();

let id = 0;

database.once('value', d => {
	data.songs = d.val() || [];

	// gets greatest songId value and sets it as starting point for adding new ids
	id = data.songs.map(song => Number(song.id)).sort().pop() || 0;

	calcTotalTime();

	renderSongs();
});

// ---------------------------------------------------------------------------------------------------------------------

// DATA
// initialize the data object

var data = {
	songs: [],
	totalTime: 0
};

// ---------------------------------------------------------------------------------------------------------------------

// DOM

const [nameInp, durInp] = document.querySelectorAll('.ui input'),
	addBtn = document.querySelector('button.add'),
	songListDisp = document.querySelector('.songs'),
	totalTimeDisp = document.querySelector('.total-time');

// ---------------------------------------------------------------------------------------------------------------------

// CONTROLLERS

// add
function addSong() {
	const name = nameInp.value || null,
		dur = durInp.value || null;

	data.songs.push({
		id: ++id,
		name: name,
		dur: dur
	});

	[nameInp, durInp].forEach(input => input.value = null);
	nameInp.focus();

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
function calcTotalTime() {
	data.totalTime = data.songs.reduce((a, b) => {
		b = b.dur.split(':');
		b = ((Number(b[0]) * 60) || 0) + (Number(b[1]) || 0);

		return a + b;
	}, 0);
}

// ---------------------------------------------------------------------------------------------------------------------

// RENDER FUNCTION

function renderSongs() {
	// send to database
	database.set(data.songs || null);

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
					<div class="inline-block">${song.name} - ${song.dur}</div>
				</div>
			`)
			.join('');

	document.querySelectorAll('.remove').forEach(remove => remove.addEventListener('click', removeSong.bind(remove)));

	calcTotalTime();
	totalTimeDisp.textContent = data.totalTime;
}