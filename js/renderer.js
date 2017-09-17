'use strict';

// ---------------------------------------------------------------------------------------------------------------------

// FIREBASE
// initialize database and vars, get/set data, render view

const database = firebase.database().ref();

let songs = [],
	id = 0;
database.once('value', d => {
	songs = d.val() || [];

	// gets greatest songId value and sets it as starting point for adding new ids
	id = songs.map(song => Number(song.id)).sort().pop() || 0;

	renderSongs();
});

// ---------------------------------------------------------------------------------------------------------------------

// DOM

const [songName, duration] = document.querySelectorAll('.ui input'),
	addBtn = document.querySelector('button.add'),
	songList = document.querySelector('.songs');

// ---------------------------------------------------------------------------------------------------------------------

// CONTROLLERS

// add
function addSong() {
	const name = songName.value || null,
		dur = duration.value || null;

	songs.push({
		id: ++id,
		name: name,
		dur: dur
	});

	[songName, duration].forEach(input => input.value = null);
	songName.focus();

	renderSongs();
}
addBtn.addEventListener('click', addSong);

// remove
function removeSong() {
	songs = songs.filter(song => {
		return song.id !== Number(this.parentElement.dataset.songId);
	});

	renderSongs();
}

// ---------------------------------------------------------------------------------------------------------------------

// RENDER FUNCTION

function renderSongs() {
	// send to database
	database.set(songs || null);

	if (songs.map)
		songList.innerHTML = songs
			.map(song => `
			<div data-song-id="${song.id}">
				<span
					class="remove"
					style="
						font-weight: bold;
						cursor: pointer;"
				>(X)
				</span>
				<div class="inline-block">${song.name} - ${song.dur}</div>
			</div>
			`)
			.join('');

	document.querySelectorAll('.remove').forEach(remove => remove.addEventListener('click', removeSong.bind(remove)));
}