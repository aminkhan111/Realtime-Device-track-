const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;

            socket.emit("send-location", { latitude, longitude });

        },
        (error) => {
            console.error(error);
        },

        {
            enableHighAccuracy:true,
            timeout: 5000,
            maximumAge:0,

        }

    );
}

const map = L.map('map').setView([0, 0], 16);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"
}).addTo(map)

 const markers = {}

 socket.on("receive-location", (data)=>{const{id, latitude, longitude} = data;

map.setView([latitude, longitude],16);


if (markers[id]) {
    // Move the marker to the new location
    markers[id].setLatLng([latitude, longitude]);
} else {
    // Create a new marker at the initial location
    markers[id] = L.marker([latitude, longitude]).addTo(map);
}
});


socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
