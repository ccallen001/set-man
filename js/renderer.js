'use strict';

// ---------------------------------------------------------------------------------------------------------------------

// FIREBASE
// initialize database and vars, get/set data, render view

const database = firebase.database().ref();

database.once('value', d => {
	data.songs = d.val() || [];

	// gets greatest songId value and sets it as starting point for adding new ids
	id = data.songs.map(song => Number(song.id)).sort().pop() || 0;

	calcTotalSongTime();

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
var age, duration, genre, id, lead, title,
	errorMessage0 = `Oops! There was an error.
Please fill out all fields and try again.

TIP: Duration must be in min:secsec format.`;

// ---------------------------------------------------------------------------------------------------------------------

// DOM

const background = document.querySelector('.background'),
	[view, add, gen] = document.querySelectorAll('nav li'),
	viewDisp = document.querySelector('.view'),
	addDisp = document.querySelector('.add'),
	genDisp = document.querySelector('.gen'),
	disps = [viewDisp, addDisp, genDisp],
	[titleInp, leadInp, genreInp, ageInp, durationInp] = document.querySelectorAll('.add input'),
	songListDisp = document.querySelector('.view .songs'),
	addBtn = document.querySelector('button.addBtn'),
	setListDisp = document.querySelector('.set'),
	genBtn = document.querySelector('button.genBtn'),
	totalSetTimeDisp = document.querySelector('.total-time');

// ---------------------------------------------------------------------------------------------------------------------

// CONTROLLERS

// nav
[view, add, gen].forEach((li, i) => {
	li.addEventListener('click', () => {
		background.style.opacity = 0.2;
		disps.forEach(li => li.classList.remove('active'));
		disps[i].classList.add('active');
	});
});

// add
function addSong() {
	title = titleInp.value.trim() || '';
	lead = leadInp.value.trim() || '';
	genre = genreInp.value.trim() || '';
	age = ageInp.value.trim() || '';
	duration = durationInp.value.trim() || '';

	if (
		!data.leads.includes(lead.toLowerCase()) ||
		!data.genres.includes(genre.toLowerCase()) ||
		window.isNaN(Number(age)) ||
		!/[0-9]:[0-9][0-9]/.test(duration)
	) {
		window.alert(errorMessage0);
	} else {

		// Where songs are made...
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

		renderSongs();

		// clear inputs
		[titleInp, leadInp, genreInp, ageInp, durationInp]
			.forEach(input => input.value = null);

		titleInp.focus();

		window.alert(`SUCCESS! ${title} added!`);
	}
}
addBtn.addEventListener('click', addSong);

// del
function delSong() {
	data.songs = data.songs.filter(song => {
		return song.id !== Number(this.parentElement.dataset.songId);
	});

	renderSongs();
}

// calculate total time
function calcTotalSongTime() {
	data.totalSetTime = data.songs.reduce((a, b) => {
		b = b.duration.split(':');
		b = ((Number(b[0]) * 60) || 0) + (Number(b[1]) || 0);

		return a + b;
	}, 0);
}

// ---------------------------------------------------------------------------------------------------------------------

// RENDER FUNCTIONS

// all songs
function renderSongs() {
	// send to database
	database.set(data.songs.length > 0 ? data.songs : null);

	if (data.songs.map)
		songListDisp.innerHTML = data.songs
			.map(song => `
				<div class="song" data-song-id="${song.id}">
					<span
						class="del"
						style="
							font-weight: bold;
							cursor: pointer;
						"
					>
						( X )
					</span>
					<div class="inline-block">
						${song.title} - <input data-song-id="${song.id}" value="${song.duration}" />
					</div>
				</div>
			`)
			.join('');

	// del songs
	document.querySelectorAll('.del').forEach(del => del.addEventListener('click', delSong.bind(del)));

	// change time
	document.querySelectorAll('.song input').forEach(time => time.addEventListener('change', function () {
		if (!/[0-9]:[0-9][0-9]/.test(this.value)) {
			window.alert(errorMessage0);
		} else {
			data.songs.filter(song => song.id === Number(this.dataset.songId))[0].duration = this.value;
		}

		renderSongs();
	}));

	calcTotalSongTime();
	totalSetTimeDisp.textContent = data.totalSetTime;
}

// set list
function renderSet() {
	if (data.songs.map)
		setListDisp.innerHTML = data.songs.sort(() => 0.5 - Math.random())
			.map(song => `
					<div>${song.title} - ${song.duration}</div>
				`)
			.join('');

	genBtn.blur();
}
genBtn.addEventListener('click', renderSet);