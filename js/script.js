/* =========================================
   AI TRAFFIC PREDICTION SYSTEM
   PROTOTYPE VERSION
========================================= */

let map = null;
let currentRoute = null;
let fromCoordinates = null;
let toCoordinates = null;

window.routeLayers = [];
window.routeMarkers = [];


/* =========================================
   PREDEFINED PROTOTYPE LOCATIONS
========================================= */

const locations = {

    "Surampalem": {
        lat: 17.0855,
        lon: 82.1455
    },

    "Kakinada": {
        lat: 16.9891,
        lon: 82.2475
    },

    "Rajahmundry": {
        lat: 17.0005,
        lon: 81.8040
    },

    "Visakhapatnam": {
        lat: 17.6868,
        lon: 83.2185
    },

    "Pithapuram": {
        lat: 17.1168,
        lon: 82.2524
    },

    "Samalkota": {
        lat: 17.0560,
        lon: 82.2380
    },

    "Anakapalle": {
        lat: 17.6910,
        lon: 83.0030
    },

    "Amalapuram": {
        lat: 16.5787,
        lon: 82.0067
    },

    "Tuni": {
        lat: 17.3560,
        lon: 82.5500
    },

    "Gandhi Circle, Kakinada": {
        lat: 16.9785,
        lon: 82.2380
    },

    "Sarpavaram": {
        lat: 16.9800,
        lon: 82.2500
    }

};


/* =========================================
   TRAFFIC SCENARIOS
========================================= */

const trafficScenarios = {

    "Surampalem|Rajahmundry": "High",
    "Rajahmundry|Surampalem": "Medium",

    "Surampalem|Kakinada": "Medium",
    "Kakinada|Surampalem": "Low",

    "Rajahmundry|Kakinada": "High",
    "Kakinada|Rajahmundry": "Medium",

    "Kakinada|Sarpavaram": "High",
    "Sarpavaram|Kakinada": "Medium",

    "Kakinada|Gandhi Circle, Kakinada": "High",
    "Gandhi Circle, Kakinada|Kakinada": "Low",

    "Kakinada|Pithapuram": "Medium",
    "Pithapuram|Kakinada": "Low",

    "Kakinada|Samalkota": "Medium",
    "Samalkota|Kakinada": "Low",

    "Kakinada|Visakhapatnam": "High",
    "Visakhapatnam|Kakinada": "Medium",

    "Rajahmundry|Visakhapatnam": "Medium",
    "Visakhapatnam|Rajahmundry": "High",

    "Rajahmundry|Pithapuram": "Low",
    "Pithapuram|Rajahmundry": "Medium",

    "Tuni|Visakhapatnam": "Medium",
    "Visakhapatnam|Tuni": "Low",

    "Amalapuram|Kakinada": "Medium",
    "Kakinada|Amalapuram": "High"

};


/* =========================================
   PROTOTYPE ALTERNATIVE ROUTES
========================================= */

const prototypeAlternatives = {

    "Kakinada|Visakhapatnam": {
        via: "Anakapalle",
        distance: "165",
        time: "3 hr 00 min",
        traffic: "Medium"
    },

    "Rajahmundry|Kakinada": {
        via: "Samalkota",
        distance: "65",
        time: "1 hr 05 min",
        traffic: "Low"
    },

    "Surampalem|Kakinada": {
        via: "Samalkota",
        distance: "55",
        time: "1 hr 00 min",
        traffic: "Low"
    },

    "Kakinada|Rajahmundry": {
        via: "Samalkota",
        distance: "65",
        time: "1 hr 05 min",
        traffic: "Low"
    },

    "Surampalem|Rajahmundry": {
        via: "Samalkota",
        distance: "75",
        time: "1 hr 20 min",
        traffic: "Medium"
    }

};


/* =========================================
   CREATE MAP
========================================= */

if (document.getElementById("trafficMap")) {

    map = L.map("trafficMap").setView(
        [16.9891, 82.2475],
        10
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

}


/* =========================================
   LOCATION SEARCH
========================================= */

function searchLocation(inputId, suggestionsId) {

    const input =
        document.getElementById(inputId);

    const suggestions =
        document.getElementById(suggestionsId);

    if (!input || !suggestions) {
        return;
    }

    const query =
        input.value.trim().toLowerCase();

    suggestions.innerHTML = "";

    if (query.length === 0) {

        suggestions.style.display =
            "none";

        return;
    }


    const matchingLocations =
        Object.keys(locations).filter(
            function(place) {

                return place
                    .toLowerCase()
                    .includes(query);

            }
        );


    if (matchingLocations.length === 0) {

        suggestions.innerHTML = `
            <div class="location-suggestion">
                No prototype location found
            </div>
        `;

        suggestions.style.display =
            "block";

        return;
    }


    matchingLocations.forEach(
        function(place) {

            const item =
                document.createElement("div");

            item.className =
                "location-suggestion";

            item.innerHTML = `
                <strong>
                    📍 ${place}
                </strong>

                <small>
                    Andhra Pradesh
                </small>
            `;


            item.addEventListener(
                "click",
                function() {

                    input.value = place;

                    const coordinates =
                        locations[place];


                    if (inputId === "fromLocation") {

                        fromCoordinates = [
                            coordinates.lat,
                            coordinates.lon
                        ];

                    }
                    else {

                        toCoordinates = [
                            coordinates.lat,
                            coordinates.lon
                        ];

                    }


                    suggestions.innerHTML = "";

                    suggestions.style.display =
                        "none";

                }
            );


            suggestions.appendChild(item);

        }
    );


    suggestions.style.display =
        "block";
}


/* =========================================
   INPUT LISTENERS
========================================= */

const fromInput =
    document.getElementById(
        "fromLocation"
    );

const toInput =
    document.getElementById(
        "toLocation"
    );


if (fromInput) {

    fromInput.addEventListener(
        "input",
        function() {

            fromCoordinates = null;

            searchLocation(
                "fromLocation",
                "fromSuggestions"
            );

        }
    );

}


if (toInput) {

    toInput.addEventListener(
        "input",
        function() {

            toCoordinates = null;

            searchLocation(
                "toLocation",
                "toSuggestions"
            );

        }
    );

}


/* =========================================
   GET TRAFFIC LEVEL
========================================= */

function getTrafficLevel(from, to) {

    const key =
        from + "|" + to;

    return trafficScenarios[key] || "Medium";
}


/* =========================================
   TRAFFIC MULTIPLIER
========================================= */

function getTrafficMultiplier(level) {

    if (level === "High") {
        return 1.30;
    }

    if (level === "Medium") {
        return 1.15;
    }

    return 1.05;
}


/* =========================================
   CLEAR OLD MAP DATA
========================================= */

function clearMapData() {

    if (!map) {
        return;
    }


    window.routeLayers.forEach(
        function(layer) {

            map.removeLayer(layer);

        }
    );


    window.routeMarkers.forEach(
        function(marker) {

            map.removeLayer(marker);

        }
    );


    window.routeLayers = [];
    window.routeMarkers = [];
}


/* =========================================
   FIND ROAD ROUTE
========================================= */

async function findRoute() {

    if (!map) {

        alert(
            "Map is not available."
        );

        return null;
    }


    if (
        !fromCoordinates ||
        !toCoordinates
    ) {

        alert(
            "Please select both locations from the suggestions."
        );

        return null;
    }


    try {

        const url =
            "https://router.project-osrm.org/route/v1/driving/" +

            fromCoordinates[1] +
            "," +
            fromCoordinates[0] +

            ";" +

            toCoordinates[1] +
            "," +
            toCoordinates[0] +

            "?alternatives=true&overview=full&geometries=geojson";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Route service unavailable"
            );
        }


        const data =
            await response.json();


        if (
            !data.routes ||
            data.routes.length === 0
        ) {

            alert(
                "No road route found."
            );

            return null;
        }


        /* Clear previous routes */

        clearMapData();


        /* =================================
           DRAW ROUTES
        ================================= */

        data.routes.forEach(
            function(route, index) {

                const coordinates =
                    route.geometry.coordinates.map(
                        function(point) {

                            return [
                                point[1],
                                point[0]
                            ];

                        }
                    );


                const routeLine =
                    L.polyline(
                        coordinates,
                        {

                            color:
                                index === 0
                                    ? "#00a6a6"
                                    : "#f59e0b",

                            weight:
                                index === 0
                                    ? 7
                                    : 5,

                            opacity:
                                index === 0
                                    ? 0.95
                                    : 0.75

                        }
                    ).addTo(map);


                window.routeLayers.push(
                    routeLine
                );


                const distance =
                    (
                        route.distance / 1000
                    ).toFixed(1);


                const duration =
                    Math.round(
                        route.duration / 60
                    );


                routeLine.bindPopup(

                    "<b>" +

                    (
                        index === 0
                            ? "Main Route"
                            : "Alternative Route"
                    ) +

                    "</b><br><br>" +

                    "Distance: " +
                    distance +
                    " km<br>" +

                    "Time: " +
                    duration +
                    " min"

                );

            }
        );


        /* =================================
           START MARKER
        ================================= */

        const startMarker =
            L.marker(
                fromCoordinates
            )
            .addTo(map)
            .bindPopup(
                "<b>Starting Location</b>"
            );


        window.routeMarkers.push(
            startMarker
        );


        /* =================================
           DESTINATION MARKER
        ================================= */

        const destinationMarker =
            L.marker(
                toCoordinates
            )
            .addTo(map)
            .bindPopup(
                "<b>Destination</b>"
            );


        window.routeMarkers.push(
            destinationMarker
        );


        /* =================================
           FIT MAP
        ================================= */

        const allPoints = [];


        data.routes.forEach(
            function(route) {

                route.geometry.coordinates.forEach(
                    function(point) {

                        allPoints.push([
                            point[1],
                            point[0]
                        ]);

                    }
                );

            }
        );


        if (allPoints.length > 0) {

            map.fitBounds(
                L.latLngBounds(allPoints),
                {
                    padding: [40, 40]
                }
            );

        }


        /* =================================
           MAIN ROUTE INFORMATION
        ================================= */

        const mainRoute =
            data.routes[0];


        const mainDistance =
            mainRoute.distance / 1000;


        const mainDuration =
            Math.round(
                mainRoute.duration / 60
            );


        showRouteInformation(
            mainDistance,
            mainDuration
        );


        return {

            distance:
                mainDistance,

            duration:
                mainDuration,

            routes:
                data.routes

        };

    }

    catch (error) {

        console.error(
            "Route error:",
            error
        );


        alert(
            "Unable to calculate the road route right now."
        );


        return null;
    }
}


/* =========================================
   ROUTE INFORMATION
========================================= */

function showRouteInformation(
    distance,
    duration
) {

    let routeInfo =
        document.getElementById(
            "routeInformation"
        );


    if (!routeInfo) {

        routeInfo =
            document.createElement(
                "div"
            );


        routeInfo.id =
            "routeInformation";


        routeInfo.style.marginTop =
            "20px";

        routeInfo.style.padding =
            "20px";

        routeInfo.style.background =
            "#ffffff";

        routeInfo.style.borderRadius =
            "14px";

        routeInfo.style.border =
            "1px solid #e4e7ec";

        routeInfo.style.boxShadow =
            "0 5px 20px rgba(0,0,0,0.06)";


        const mapElement =
            document.getElementById(
                "trafficMap"
            );


        if (mapElement) {

            mapElement.parentNode.appendChild(
                routeInfo
            );

        }

    }


    const hours =
        Math.floor(
            duration / 60
        );


    const minutes =
        duration % 60;


    let timeText;


    if (hours > 0) {

        timeText =
            hours +
            " hr " +
            minutes +
            " min";

    }
    else {

        timeText =
            minutes +
            " min";

    }


    routeInfo.innerHTML = `

        <h3 style="
            margin-bottom:15px;
            color:#102a43;
        ">
            🛣️ Route Information
        </h3>


        <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:15px;
        ">

            <div>

                <p style="
                    color:#667085;
                    font-size:12px;
                ">
                    Distance
                </p>

                <strong style="
                    font-size:20px;
                    color:#102a43;
                ">
                    ${distance.toFixed(1)} km
                </strong>

            </div>


            <div>

                <p style="
                    color:#667085;
                    font-size:12px;
                ">
                    Normal Travel Time
                </p>

                <strong style="
                    font-size:20px;
                    color:#102a43;
                ">
                    ${timeText}
                </strong>

            </div>

        </div>
    `;
}


/* =========================================
   ANALYZE TRAFFIC
========================================= */

async function analyzeTraffic() {

    const fromElement =
        document.getElementById(
            "fromLocation"
        );

    const toElement =
        document.getElementById(
            "toLocation"
        );


    if (!fromElement || !toElement) {

        alert(
            "Location fields are not available."
        );

        return;
    }


    const from =
        fromElement.value.trim();


    const to =
        toElement.value.trim();


    if (!from || !to) {

        alert(
            "Please select both locations."
        );

        return;
    }


    if (
        !locations[from] ||
        !locations[to]
    ) {

        alert(
            "Please select locations from the suggestions."
        );

        return;
    }


    /* Make sure coordinates exist */

    fromCoordinates = [
        locations[from].lat,
        locations[from].lon
    ];

    toCoordinates = [
        locations[to].lat,
        locations[to].lon
    ];


    const route =
        await findRoute();


    if (!route) {
        return;
    }


    /* =================================
       GET TRAFFIC
    ================================= */

    const trafficLevel =
        getTrafficLevel(
            from,
            to
        );


    const multiplier =
        getTrafficMultiplier(
            trafficLevel
        );


    const predictedMinutes =
        Math.round(
            route.duration *
            multiplier
        );


    /* =================================
       SAVE ROUTE
    ================================= */

    localStorage.setItem(
        "selectedTrafficRoute",
        JSON.stringify({

            from: from,

            to: to,

            distance:
                route.distance.toFixed(1),

            normalTime:
                route.duration,

            predictedTime:
                predictedMinutes,

            traffic:
                trafficLevel,

            alternativeAvailable:
                route.routes.length > 1

        })
    );


    /* =================================
       TRAFFIC RESULT
    ================================= */

    const result =
        document.getElementById(
            "trafficResult"
        );


    if (result) {

        result.style.display =
            "block";

    }


    /* =================================
       ROUTE NAME
    ================================= */

    const routeName =
        document.getElementById(
            "routeName"
        );


    if (routeName) {

        routeName.innerHTML =
            from +
            " → " +
            to;

    }


    /* =================================
       CURRENT TRAFFIC
    ================================= */

    const currentTraffic =
        document.getElementById(
            "currentTraffic"
        );


    if (currentTraffic) {

        currentTraffic.innerHTML =

            trafficLevel === "High"
                ? "🔴 High"

                : trafficLevel === "Medium"
                    ? "🟡 Medium"

                    : "🟢 Low";

    }


    /* =================================
       PREDICTED TRAFFIC
    ================================= */

    const predictedTraffic =
        document.getElementById(
            "predictedTraffic"
        );


    if (predictedTraffic) {

        predictedTraffic.innerHTML =

            trafficLevel === "High"
                ? "🔴 High"

                : trafficLevel === "Medium"
                    ? "🟡 Medium"

                    : "🟢 Low";

    }


    /* =================================
       PREDICTED TIME
    ================================= */

    const estimatedTime =
        document.getElementById(
            "estimatedTime"
        );


    const hours =
        Math.floor(
            predictedMinutes / 60
        );


    const minutes =
        predictedMinutes % 60;


    let predictedTime;


    if (hours > 0) {

        predictedTime =
            hours +
            " hr " +
            minutes +
            " min";

    }
    else {

        predictedTime =
            minutes +
            " min";

    }


    if (estimatedTime) {

        estimatedTime.innerHTML = `

            <strong style="
                display:block;
                font-size:20px;
                color:#102a43;
            ">
                ${predictedTime}
            </strong>

            <small style="
                display:block;
                margin-top:8px;
                color:#667085;
            ">
                Predicted travel time
            </small>

        `;

    }


    /* =================================
       RECOMMENDATION
    ================================= */

    const recommendation =
        document.getElementById(
            "recommendation"
        );


    if (recommendation) {

        if (trafficLevel === "High") {

            recommendation.innerHTML =
                "🔴 High traffic is predicted. " +
                "An alternative route is recommended.";

        }

        else if (
            trafficLevel === "Medium"
        ) {

            recommendation.innerHTML =
                "🟡 Moderate traffic is expected. " +
                "The main route can still be considered.";

        }

        else {

            recommendation.innerHTML =
                "🟢 Traffic is expected to be low. " +
                "The main route is recommended.";

        }

    }


    /* =================================
       ALTERNATIVE ROUTE CARD
    ================================= */

    const alternativeBox =
        document.getElementById(
            "alternativeRoute"
        );


    const alternativeText =
        document.getElementById(
            "alternativeText"
        );


    const alternativeButton =
        document.getElementById(
            "useAlternativeBtn"
        );


    /* =================================
       HIGH TRAFFIC ALTERNATIVE
    ================================= */

    if (trafficLevel === "High") {

        let alternativeDistance =
            "N/A";

        let alternativeDuration =
            "N/A";

        let alternativeName =
            "Nearby Alternative Route";

        let alternativeTraffic =
            "Medium";


        /* REAL OSRM ALTERNATIVE */

        if (route.routes.length > 1) {

            const alternative =
                route.routes[1];


            alternativeDistance =
                (
                    alternative.distance / 1000
                ).toFixed(1) +
                " km";


            alternativeDuration =
                Math.round(
                    alternative.duration / 60
                ) +
                " min";


            alternativeName =
                "OSRM Alternative Route";


            alternativeTraffic =
                "Medium";

        }


        /* PROTOTYPE FALLBACK */

        else {

            const key =
                from + "|" + to;


            const prototype =
                prototypeAlternatives[key];


            if (prototype) {

                alternativeDistance =
                    prototype.distance +
                    " km";

                alternativeDuration =
                    prototype.time;

                alternativeName =
                    prototype.via;

                alternativeTraffic =
                    prototype.traffic;

            }

        }


        /* SHOW CARD */

        if (alternativeBox) {

            alternativeBox.style.display =
                "block";

        }


        /* SHOW INFORMATION */

        if (alternativeText) {

            alternativeText.innerHTML = `

                <strong>
                    ⭐ AI Recommended Alternative Route
                </strong>

                <br><br>

                🛣️ Route:
                ${from}
                →
                ${alternativeName}
                →
                ${to}

                <br><br>

                📏 Distance:
                ${alternativeDistance}

                <br>

                ⏱️ Estimated Time:
                ${alternativeDuration}

                <br><br>

                🚦 Traffic:
                ${alternativeTraffic === "High"
                    ? "🔴 High"
                    : alternativeTraffic === "Medium"
                        ? "🟡 Medium"
                        : "🟢 Low"
                }

                <br><br>

                <span style="
                    color:#008c8c;
                    font-weight:600;
                ">
                    💡 This route is suggested as
                    an alternative to the high-traffic
                    main route.
                </span>

            `;

        }


        /* SHOW BUTTON */

        if (alternativeButton) {

            alternativeButton.style.display =
                "inline-block";

        }

    }

    else {

        /* HIDE ALTERNATIVE */

        if (alternativeBox) {

            alternativeBox.style.display =
                "none";

        }


        if (alternativeButton) {

            alternativeButton.style.display =
                "none";

        }

    }


    /* =================================
       AI FACTOR SUPPORT
    ================================= */

    updateAIFactors(
        trafficLevel,
        route.duration,
        predictedMinutes
    );

}


/* =========================================
   AI FACTORS
========================================= */

function updateAIFactors(
    trafficLevel,
    normalMinutes,
    predictedMinutes
) {

    const travelTimeFactor =
        document.getElementById(
            "travelTimeFactor"
        );


    const trafficFactorText =
        document.getElementById(
            "trafficFactorText"
        );


    const predictionFactor =
        document.getElementById(
            "predictionFactor"
        );


    const delay =
        Math.max(
            0,
            predictedMinutes -
            normalMinutes
        );


    if (travelTimeFactor) {

        travelTimeFactor.innerHTML =
            "Normal: " +
            normalMinutes +
            " min<br>" +

            "Predicted: " +
            predictedMinutes +
            " min<br>" +

            "Delay: +" +
            delay +
            " min";

    }


    if (trafficFactorText) {

        trafficFactorText.innerHTML =
            "Current: 🟡 Medium<br>" +

            "Predicted: " +

            (
                trafficLevel === "High"
                    ? "🔴 High"
                    : trafficLevel === "Medium"
                        ? "🟡 Medium"
                        : "🟢 Low"
            );

    }


    if (predictionFactor) {

        predictionFactor.innerHTML =
            "Traffic prediction: " +
            trafficLevel +
            "<br>" +

            "Recommendation: " +

            (
                trafficLevel === "High"
                    ? "Use alternative route"
                    : trafficLevel === "Medium"
                        ? "Drive with caution"
                        : "Main route recommended"
            );

    }

}


/* =========================================
   USE ALTERNATIVE ROUTE
========================================= */

const alternativeButton =
    document.getElementById(
        "useAlternativeBtn"
    );


if (alternativeButton) {

    alternativeButton.addEventListener(
        "click",
        function() {

            if (!map) {
                return;
            }


            /* REAL OSRM ALTERNATIVE */

            if (
                window.routeLayers &&
                window.routeLayers.length >= 2
            ) {

                const alternative =
                    window.routeLayers[1];


                map.fitBounds(
                    alternative.getBounds(),
                    {
                        padding: [40, 40]
                    }
                );


                alternative.openPopup();

                return;

            }


            /* PROTOTYPE FALLBACK */

            alert(
                "The recommended alternative route is a prototype route suggestion."
            );

        }
    );

}


/* =========================================
   CLOSE SUGGESTIONS
========================================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.closest(
                ".location-search"
            )
        ) {

            const fromSuggestions =
                document.getElementById(
                    "fromSuggestions"
                );


            const toSuggestions =
                document.getElementById(
                    "toSuggestions"
                );


            if (fromSuggestions) {

                fromSuggestions.style.display =
                    "none";

            }


            if (toSuggestions) {

                toSuggestions.style.display =
                    "none";

            }

        }

    }
);
