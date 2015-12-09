var map;
var place_curr;
var place_dest;

var markers_currLoc= [];
var markers_destLoc= [];
var circle_currLoc =[];
var circle_destLoc =[];
var radius_destLoc =[];
var radius_currLoc =[];
var circleResults = null;


// Google autocomplete for places and Map
function google_maps() {

    var options = {
        types: ['(cities)'],
        componentRestrictions: {country: "can"}
    };

    var options2 = {
        // types:  ['establishment'],
        componentRestrictions: {country: "can"}
    };

    var mapProp = {
        center:new google.maps.LatLng( 47.05, -74),
        zoom:8,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    var curr_input = document.getElementById('currentLocation');
    var dest_input = document.getElementById('destination');
    var input = document.getElementById('pac-input');

    var autocompleteCurr = new google.maps.places.Autocomplete(curr_input,options);
    var autocompleteDest = new google.maps.places.Autocomplete(dest_input,options);
    var autocompletePlaces = new google.maps.places.Autocomplete(input,options2);


    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });



    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng, map);

    });

    google.maps.event.addListener(autocompleteCurr, 'place_changed', function() {

        place_curr =  autocompleteCurr.getPlace();
        var place = autocompleteCurr.getPlace();

        if (!place.geometry) {
            return;
        }
        if (place.geometry.viewport) {

            map.setCenter(place.geometry.location);
            map.setZoom(15);



        }

    });

    google.maps.event.addListener(autocompleteDest, 'place_changed', function() {
        place_dest =  autocompleteDest.getPlace();
    });

    google.maps.event.addListener(autocompletePlaces, 'place_changed', function() {

        infowindow.close();
        marker.setVisible(false);
        var place = autocompletePlaces.getPlace();
        if (!place.geometry) {
            //window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            placeMarker(place.geometry.location,map);
            //     map.setCenter(place.geometry.location);
            //   map.setZoom(15);  // Why 17? Because it looks good.
            /*   var service = new google.maps.places.PlacesService(map);
             service.nearbySearch({
             location: place_curr.geometry.location,
             radius: 500,
             types: ['store']
             }, callback);
             */
        }
        marker.setIcon(({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        // marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
    });

    map.panTo(place.geometry.location);

}


function initialize_resultMap(){

    var jsonString = document.getElementById("jsonObject").value;
    var jsonObject =  JSON.parse(jsonString);
    var center;
    var address;

    if(jsonObject.length != undefined){
        center = new google.maps.LatLng( jsonObject[0].latitudePickup, jsonObject[0].longitudePickup);
        address = jsonObject[0].startAddress;
    }
    else{
        center = new google.maps.LatLng( jsonObject.latitudePickup, jsonObject.longitudePickup);
        address = jsonObject.startAddress;
    }



    var geocoder = new google.maps.Geocoder;

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            var tmp_long= results[0].geometry.location.lng();
            var tmp_lat = results[0].geometry.location.lat();
            center =  new google.maps.LatLng( tmp_long,tmp_lat);
            map.panTo(results[0].geometry.location);
        }

    });

    var mapProp = {
        center:center,
        zoom:12,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("googleMap-results"), mapProp);

}




//google.maps.event.addDomListener(window, 'load', initialize); //This line might seem out of place but it is necessary.

// Google autocomplete for Results
function displayResults() {
    var jsonString = document.getElementById("jsonObject").value;
    var jsonObject =  JSON.parse(jsonString);
    var infowindow = new google.maps.InfoWindow();
    var previous_marker=null;
    var previous_radius =null;
    var content ="";
    var lastIndex = jsonObject.length-1;


    if(jsonObject.length ==undefined){

        var latitudePickup = jsonObject.latitudePickup;
        var longitudePickUp = jsonObject.longitudePickup;
        var latlng = {lat: parseFloat(latitudePickup), lng: parseFloat(longitudePickUp)};
        var marker = new google.maps.Marker({
            position: latlng,
        });


        content = infoWindowContent(jsonObject);
        marker.setMap(map);
        addInfoToMarker(marker, content, infowindow, jsonObject.radiusPickUp);

    }

    else {

        jsonObject = sortJson(jsonObject, 'longitudePickup', true);

        for (var i = 0; i < jsonObject.length; i++) {

            var radiusPickup = jsonObject[i].radiusPickUp;
            var marker = createMarkerFromPosition(jsonObject, i);

            if ((i != 0 && !marker.getPosition().equals(previous_marker.getPosition()))) {
                previous_marker.setMap(map);
                addInfoToMarker(previous_marker, content, infowindow, previous_radius);
                content = infoWindowContent(jsonObject[i]);

            }

            else {
                content += infoWindowContent(jsonObject[i]);
            }

            previous_marker = marker;
            previous_radius = radiusPickup;
        }

        previous_marker.setMap(map);
        addInfoToMarker(previous_marker, content, infowindow, jsonObject[lastIndex].radiusPickUp);
    }


}

function infoWindowContent(jsonObject){

    var content ='';

    if(jsonObject.cost == undefined){
        content = '<a onmouseover=\"\" style=\"cursor: pointer;\" onclick=\'document.getElementById(\"'+jsonObject.passenger+'\").click();\'>' +
            jsonObject.name+'</a></br>';
    }
    else{
        content = '<a onmouseover=\"\" style=\"cursor: pointer;\" onclick=\'document.getElementById(\"'+jsonObject.driver+'\").click();\'>' +
            jsonObject.name+'</br>'+jsonObject.cost+'$</a></br>';
    }



    return content;

}

function addInfoToMarker(previous_marker,content,infowindow,radiusPickup){

    google.maps.event.addListener(previous_marker,'click', (function(previous_marker,content,infowindow,radiusPickup){
        return function() {
            infowindow.setContent(content);
            infowindow.open(map,previous_marker);
            drawRadius_Results(previous_marker, radiusPickup);

        };
    })(previous_marker,content,infowindow,radiusPickup));

}

function createMarkerFromPosition(jsonObject,index){
    var latitudePickup = jsonObject[index].latitudePickup;
    var longitudePickUp = jsonObject[index].longitudePickup;

    var latlng = {lat: parseFloat(latitudePickup), lng: parseFloat(longitudePickUp)};

    var marker = new google.maps.Marker({
        position: latlng,
    });

    return marker;

}

function callback(results, status) {

    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function placeMarker(location,map) {

    var marker_arr = markers_currLoc;
    var icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    var input_loc =document.getElementById('selectedPickupPoint');
    var message_input ="Lieu de départ: ";
    var address = " ";
    var hiddenInput = document.getElementById("curr-latLong");

    if(document.getElementById('radio-map-destination').checked) {
        marker_arr = markers_destLoc;
        icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
        input_loc = document.getElementById('selectedDropOffPoint');
        message_input ="Lieu d'arrivé: ";
        hiddenInput = document.getElementById("dest-latLong");
    }


    if (marker_arr.length > 0){
        var km =  document.getElementById('radius').value;
        deleteMarkers();
        document.getElementById('radius').value = km;
    }
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true,
        icon: icon
    });



    if(document.getElementById('pac-input').value != ''){
        input_loc.value= message_input+document.getElementById('pac-input').value;

    }
    else{
        reverseGeocode(message_input,input_loc,location.toString());
    }


    hiddenInput.value = location.toString().slice(1,-1).trim();
    map.setCenter(location);
    marker_arr.push(marker);
    map.panTo(position);


}

function drawTrip(){

    var jsonString = document.getElementById("jsonObject").value;
    var jsonObject =  JSON.parse(jsonString);
    var latitudePickup = jsonObject.latitudePickup;
    var longitudePickUp = jsonObject.longitudePickup;
    var latlng_pickup = {lat: parseFloat(latitudePickup), lng: parseFloat(longitudePickUp)};

    var latitudeDropOff = jsonObject.latitudeDropOff;
    var longitudeDropOff = jsonObject.longitudeDropOff;
    var latlng_dropOff = {lat: parseFloat(latitudeDropOff), lng: parseFloat(longitudeDropOff)};
    var rendererOptions={map:map};

    directionsDisplay=new google.maps.DirectionsRenderer(rendererOptions);

    var org =latlng_pickup;
    var dest = latlng_dropOff;

    var request={
        origin:org,
        destination:dest,
        travelMode:google.maps.DirectionsTravelMode.DRIVING

    };
    directionsService=new google.maps.DirectionsService();
    directionsService.route(request,function(response,status){
        if(status==google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(response);
            computeTotalDistance(directionsDisplay.directions);
        }

    });


}


function computeTotalDistance(result) {
    var total = 0;
    var time= 0;
    var from=0;
    var to=0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
        time +=myroute.legs[i].duration.text;
        from =myroute.legs[i].start_address;
        to =myroute.legs[i].end_address;


    }
    time = time.replace('hours','H');
    time = time.replace('mins','M');
    total = total / 1000.


    var km =Math.round( total)+" KM" ;
    var old_text = document.getElementById('duration').innerHTML;
    //  document.getElementById('from').innerHTML = from;
    // document.getElementById('to').innerHTML = to;
    document.getElementById('duration').innerHTML =old_text+ time+' ('+km+')' ;

}

function reverseGeocode(message_input,input_loc, location) {


    location = location.slice(1,-1);
    var latlngStr = location.split(',', 2);

    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    var geocoder = new google.maps.Geocoder;

    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                if(results[1].formatted_address.indexOf(" / ") != -1){
                    input_loc.value= message_input+results[1].formatted_address;
                }

                else{
                    input_loc.value= message_input+results[0].formatted_address;
                }

            } else {
                input_loc.value= message_input+results[1].formatted_address;
            }
        }

    });

}

function deleteMarkers() {


    var marker_arr = markers_currLoc;
    var circle_arr = circle_currLoc;
    var radius_arr = radius_currLoc;

    if(document.getElementById('radio-map-destination').checked) {
        marker_arr = markers_destLoc;
        circle_arr = circle_destLoc;
        radius_arr = radius_destLoc;
    }


    if (marker_arr) {
        for (i in marker_arr) {
            marker_arr[i].setMap(null);
        }
        marker_arr.length = 0;

        for (i in circle_arr) {
            circle_arr[i].setMap(null);
        }
        circle_arr.length = 0;
        radius_arr.length =0;
        $('#radius').val("");
    }





}

//Draws a radius on Google Map.

function drawRadius(){

    var km =  document.getElementById('radius').value;
    var marker_arr = markers_currLoc;
    var circle_arr = circle_currLoc;
    var radius_arr = radius_currLoc;
    var color = "#00FF00";
    var hiddenInput = document.getElementById("radius-curr");



    if(document.getElementById('radio-map-destination').checked) {
        marker_arr = markers_destLoc;
        circle_arr = circle_destLoc;
        radius_arr = radius_destLoc;
        color = "#FF0000";
        hiddenInput = document.getElementById("radius-dest");
    }


    if(km > 1000)km=1000;


    if(circle_arr.length>0){
        for (i in circle_arr) {
            circle_arr[i].setMap(null);
        }
        circle_arr.length = 0;

    }

    radius_arr.length = 0;
    //for (marker in markers_currLoc) {
    for(i=0; i < marker_arr.length;i++){
        // Add the circle for this city to the map.
        var circle = new google.maps.Circle({
            map: map,
            radius: km*1,
            fillColor: color
        });


        radius_arr.push(km);
        circle_arr.push(circle);
        circle.bindTo('center', marker_arr[i], 'position');
        hiddenInput.value = km;

    }

}

function drawRadius_Results(position, radius){

    if(circleResults!=null)circleResults.setMap(null);
    var circle = new google.maps.Circle({
        map: map,
        radius: radius*1,
        fillColor:"#FF0000"
    });

    circle.bindTo('center',position, 'position');
    circleResults = circle;

}

function sortJson(jsonObject,prop, asc) {

    jsonObject = jsonObject.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    });

    return jsonObject;

}


//Draws radius when clicking on the map
$(".googleMap").click(function() {
    drawRadius();
});

//Resets the markers when the button is clicked.
$(".reset-markers").click(function() {
    deleteMarkers();
});


//Changes the radius when pressing enter on the meters input box.
$('.radius').bind('keypress', function(e) {
    if(e.keyCode==13){
        drawRadius();
    }
});


//Draws radius on change
$( ".radius" ).change(function() {
    drawRadius();
});

$('#currentLocationMap').click(function() {

    var curr_input = document.getElementById('currentLocation');

    if(curr_input.value.length == 0)return;

    if(radius_currLoc.length>0)$('#radius').val(radius_currLoc[0]);
    else $('#radius').val("");


    if(markers_currLoc.length>0){
        map.setCenter(markers_currLoc[0].getPosition());

    }

    else{

        var place = place_curr;
        if (!place.geometry)return;
        if (place.geometry.viewport) {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }
    }

    $('#pac-input').val("");

});


$('#destinationMap').click(function() {

    var dest_input = document.getElementById('destination');

    if(dest_input.value.length == 0)return;

    if(radius_destLoc.length>0)$('#radius').val(radius_destLoc[0]);
    else $('#radius').val("");

    if(markers_destLoc.length>0){
        map.setCenter(markers_destLoc[0].getPosition());
    }

    else{

        var place = place_dest;
        if (!place.geometry)return;
        if (place.geometry.viewport) {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }
    }
    $('#pac-input').val("");

});

function resizeMap()
{
    google.maps.event.trigger(map,'resize');
    map.setZoom( map.getZoom() );
}

