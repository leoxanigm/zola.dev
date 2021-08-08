let hotels = [
    {
	id: "hotel-1",
	name: "Château d'Ouchy",
	location: "Lausanne, Switzerland",
	stars: 4,
	lakeView: true,
	image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Ouchy_2.jpg/1024px-Ouchy_2.jpg",
	rooms: 50,
	roomsBooked: 32,
	roomsAvailable: function() {return this.rooms - this.roomsBooked}
},
{
	id: "hotel-2",
	name: "Beau-Rivage Palace",
	location: "Lausanne, Switzerland",
	stars: 5,
	lakeView: true,
	image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Hotel_beau_rivage_palace.jpg/1280px-Hotel_beau_rivage_palace.jpg",
	rooms: 169,
	roomsBooked: 142,
	roomsAvailable: function() {return this.rooms - this.roomsBooked}
},
  {
	id: "hotel-3",
	name: "Lausanne Palace",
	location: "Lausanne, Switzerland",
	stars: "4",
	lakeView: false,
	image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Hotel_Lausanne_Palace_%28cropped%29.jpg/800px-Hotel_Lausanne_Palace_%28cropped%29.jpg",
	rooms: 106,
	roomsBooked: 106,
	roomsAvailable: function() {return this.rooms - this.roomsBooked}
}]

function getOption() {
	document.getElementsByClassName("welcome")[0].style.display = "none";
	document.getElementsByClassName("hotel-details")[0].style.display = "block";
	let formSelect = document.getElementById("hotel-selection");
	let hotelId = formSelect.value, selectedHotel = {};
	for(i = 0; i < hotels.length; i++) {
		if(hotels[i].id == hotelId) {
			selectedHotel = hotels[i];
			
		}
	}
	let name = document.getElementById("hotel-name");
	let location = document.getElementById("hotel-location");
	let image = document.getElementById("hotel-img");
	let rooms = document.getElementById("rooms");
	let roomsAvailable = document.getElementById("avail-rooms");
	let stars = document.getElementById("stars");
	let lakeView = document.getElementById("lake-view");

	name.textContent = selectedHotel.name;
	location.textContent = selectedHotel.location;
	image.src = selectedHotel.image;
	rooms.textContent = selectedHotel.rooms;

	roomsAvailable.textContent = selectedHotel.roomsAvailable();
	
	if (selectedHotel.roomsAvailable() == 0) {
		roomsAvailable.className = "no-rooms";
	} else {
		roomsAvailable.className = "";
	}

	let starIcon = "&#9733;", starRating = "";
	for(i = 0; i < selectedHotel.stars; i++) starRating += starIcon;
	stars.innerHTML = starRating;

	if(selectedHotel.lakeView == true) {
		lakeView.innerHTML = "&#10003;";
		lakeView.className = "";
	} else {
		lakeView.innerHTML = "&#10007;";
		lakeView.className = "no-lake-view";
	}
}