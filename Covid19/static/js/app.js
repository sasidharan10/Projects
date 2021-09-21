mapboxgl.accessToken = 'pk.eyJ1Ijoic2FzaWRoYXJhbjEwIiwiYSI6ImNrcDhhdGtlYzA4Z3EydXA3OXc0NHl3N3QifQ.hhlLewMbrP5XZYGfGhhA0w';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [80, 20],
    zoom: 3.5,
    minZoom: 1
});

map.on('mouseover', () => {
    map.getCanvas().style.cursor = 'default'
})
map.on('mouseleave', () => {
    map.getCanvas().style.cursor = ''
})

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
    })
);

map.addControl(new mapboxgl.NavigationControl());

// map.dragRotate.disable();
// map.touchZoomRotate.disableRotation();
// map.scrollZoom.disable();

fetch("https://api.covid19api.com/summary")
    .then(Response => Response.json())
    .then(res => {
        console.log(res);
        console.log(res.Countries);  // checking the data

        var worldCases = document.getElementById("world-cases-count");
        var worldRecovered = document.getElementById("world-recovered-count");
        var worldDeaths = document.getElementById("world-deaths-count");

        var worldCasesCount = `<p>${res.Global.TotalConfirmed.toLocaleString()}</p>`;
        var worldRecoveredCount = `<p>${res.Global.TotalRecovered.toLocaleString()}</p>`;
        var worldDeathsCount = `<p>${res.Global.TotalDeaths.toLocaleString()}</p>`;

        worldCases.innerHTML = worldCasesCount;
        worldRecovered.innerHTML = worldRecoveredCount;
        worldDeaths.innerHTML = worldDeathsCount;

        let i = 1;

        var table = document.getElementById("country-body");

        res.Countries.forEach(elm => {

            var details =
                `<tr>
                    <td>${i}</td>
                    <td>${elm.Slug.toLocaleString()}</td>
                    <td id="table-cases">${elm.TotalConfirmed.toLocaleString()}</td>
                    <td id="table-recovered">${elm.TotalRecovered.toLocaleString()}</td>
                    <td id="table-deaths">${elm.TotalDeaths.toLocaleString()}</td>
                </tr>`;
            i++;

            table.innerHTML += details;

            let country = elm.Slug;
            let cases = elm.TotalConfirmed;
            let recovered = elm.TotalRecovered.toLocaleString();
            let death = elm.TotalDeaths.toLocaleString();
            let colors;

            if (cases >= 1000000) {
                colors = "rgb(255, 0, 0)";
            }
            else if (cases > 300000 && cases < 999999) {
                colors = "rgb(255, 102, 0)";
            }
            else if (cases > 100000 && cases < 299999) {
                colors = "rgb(255, 255, 0)";
            }
            else if (cases > 20000 && cases < 99999) {
                colors = "rgb(0, 204, 0)";
            }
            else {
                colors = "rgb(0, 255, 255)";
            }

            let fcases = cases.toLocaleString(); // in million format

            var popup = new mapboxgl.Popup(
                {
                    offset: [0, 0],
                    closeButton: false
                }
            ).setHTML(
                '<h3>' + country + '</h3><p id="infected">Infected &nbsp;&nbsp;&nbsp;&nbsp;&nbsp :&nbsp '
                 + fcases + '</p><p id="recovered">Recovered &nbsp:&nbsp ' + recovered + 
                 '</p><p id="death">Deaths &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp : &nbsp' 
                 + death + '</p>'
            )

            var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
            mapboxClient.geocoding
                .forwardGeocode({
                    query: `${country}`,
                    autocomplete: false,
                    limit: 1
                })
                .send()
                .then(function (response) {
                    if (
                        response &&
                        response.body &&
                        response.body.features &&
                        response.body.features.length
                    ) {
                        var feature = response.body.features[0];
                        console.log(response);

                        // Create a marker and add it to the map.
                        let marker = new mapboxgl.Marker({
                            draggable: false,
                            color: colors,
                            scale: 0.6  // resize
                        }).setLngLat(feature.center).addTo(map);

                        var element = marker.getElement();
                        // element.id = 'marker';
                        // hover event listener
                        element.addEventListener('mouseenter', () => popup.addTo(map));
                        element.addEventListener('mouseleave', () => popup.remove());

                        // add popup to marker
                        marker.setPopup(popup);

                    }
                });
        });
    }).catch(error => {
        console.log("Error Occured");
    });

