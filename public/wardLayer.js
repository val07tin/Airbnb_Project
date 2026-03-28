function createWardLayer(geojsonData, map) {

    var layer = L.geoJSON(geojsonData, {

        style: function(feature) {
          return {
            color: "black",
            weight: 2,
            fillOpacity: 0.6,
            fillColor: getColor(feature.properties.avg_price) // dynamic!
          };
        },


onEachFeature: function(feature, layer) {

    // Convert ward name to number
    const wardMap = {
        "FIRST WARD": "1",
        "SECOND WARD": "2",
        "THIRD WARD": "3",
        "FOURTH WARD": "4",
        "FIFTH WARD": "5",
        "SIXTH WARD": "6",
        "SEVENTH WARD": "7",
        "EIGHTH WARD": "8",
        "NINTH WARD": "9",
        "TENTH WARD": "10",
        "ELEVENTH WARD": "11",
        "TWELFTH WARD": "12",
        "THIRTEENTH WARD": "13",
        "FOURTEENTH WARD": "14",
        "FIFTEENTH WARD": "15"
    };

    const wardNumber = wardMap[feature.properties.ward] || feature.properties.ward;
    const priceFormatted = `$${Number(feature.properties.avg_price).toFixed(2)}`; // convert number to string

   
    // Permanent label = ward number
    layer.bindTooltip(wardNumber, {
        permanent: true,
        direction: "center",
        className: "ward-label",
    }).addTo(map);

    // Hover shows price as a string
    layer.on("mouseover", function () {
        layer.setTooltipContent(priceFormatted); // must be string
    });

    layer.on("mouseout", function () {
        layer.setTooltipContent(wardNumber); // string
    });

}



    }).addTo(map);

    return layer;  
}



function getColor(price) {
    // if price is a string, remove $; otherwise just use number
    let num = typeof price === "string" ? Number(price.replace(/\$/g, '')) : Number(price);

    if (num > 200) return "#800026";  // dark red
    else if (num > 140) return "#BD0026"; // red
    else if (num > 100) return "#E31A1C"; // orange-red
    else if (num > 75) return "#FC4E2A";  // orange
    else if (num > 50) return "#FD8D3C";  // yellow-orange
    else return "#FED976";               // yellow / cheap
}



