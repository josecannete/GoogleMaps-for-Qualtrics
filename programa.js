API_KEY = "TuAPIKEYdeGoogleMaps"


/*
Habran dos tipos de queries distintas:
typeQuery = 1 son queries donde solo queremos marcar un punto del mapa
typeQuery = 2 son queries donde nos interesa un camino (polyline)
*/

typeQuery = 2;

// Si la query es de polyline, es necesario escribir el maximo de puntos a aceptar
maxPoints = 25;

// Si la query es de tipo 1, debemos ingresar el numero del cuadro de texto en que guardaremos los datos (0-indexado)
cuadroLatitud = 0;
cuadroLongitud = 1;


var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY;
document.body.appendChild(script);


var canvas;
var map;
var markers = [];
var points = [];
var question = this;
var listener;
var Caminos;
var geocoder;
var contadorPuntos = 0;

/*
Lanza el programa principal, iniciando un mapa segun el tipo de query
*/
initMapx = function() {
  canvas = null;
  map = null;
  markers = [];
  points = [];
  question = this;
  listener = null;
  Caminos = null;
  geocoder = null;
  contadorPuntos = 0;
  configurarCanvas();
  var mapOptions = {
      zoom: 15,
      center: new google.maps.LatLng(-33.4569400,-70.6482700),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

  map = new google.maps.Map(canvas, mapOptions);


  // GEOLOCALIZACION

  //  HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // GEOCODER
  geocoder = new google.maps.Geocoder;


  // QUERIES

  if (typeQuery == 1) {
    singlePointQuery();
  }
  else if (typeQuery == 2) {
    polylineQuery();
  }
}

/*
Sirve para setear el canvas del mapa
*/
function configurarCanvas(){
	
    background = document.createElement("div");
    background.id = 'map_canvas_background';
    background.setAttribute('style', 'position: absolute; width: 100%; height: 100%; background-color: auto; opacity: 0.6;filter:alpha(opacity=60); top: 0px;');
    document.body.appendChild(background);

    wrapper = document.createElement("div");
    wrapper.id = 'map_canvas_wrapper';
    wrapper.setAttribute('style', 'position: absolute; width: 100%; height: 100%; margin: auto; text-align: center; top: 0px;');
    document.body.appendChild(wrapper);

    canvas = document.createElement("div");
    canvas.id = 'map_canvas';
    canvas.setAttribute('style', 'width: 90%; height: 90%; margin: 5px auto; ');
    wrapper.appendChild(canvas);

    // Boton para cerrar mapa

    button = document.createElement("button");
    button.innerHTML = "Cerrar";
    button.onclick = function(){
      document.getElementById('map_canvas_background').remove();
      document.getElementById('map_canvas_wrapper').remove();
      google.maps.event.removeListener(listener);
      console.log("remove listener");
		
      if (typeQuery == 1){
        var aux = markers.map(markerToLatLng);
        points = aux.map(latLngToPoint);
        console.log(points[0].lat);
        var text1 = $(question.getChoiceContainer()).down('.InputText', cuadroLatitud);
        var text2 = $(question.getChoiceContainer()).down('.InputText', cuadroLongitud);
        text1.value = points[0].lat;
        text2.value = points[0].lng;
      }
		
      else{
        points = Caminos.getPath().getArray().map(latLngToPoint);
        var agregar = "";
        for (i = 0; i < contadorPuntos; i++){
          agregar += points[i].lat.toString() + ',' +
           points[i].lng.toString() + '\n';
        }
        Qualtrics.SurveyEngine.setEmbeddedData('Puntos', agregar);

      }
      console.log(points);
    };
    wrapper.appendChild(button);

    // Boton para borrar ultimo punto.

    if (typeQuery == 2){
      buttonEliminar = document.createElement("button");
      buttonEliminar.innerHTML = "Remover ultimo punto";
      buttonEliminar.onclick = function() {
        removePos();
      };
      wrapper.appendChild(buttonEliminar);
    }
}

// Coloca un marcador en el mapa, y lo almacena en 'markers'.
function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}

// Coloca los marcadores almacenado en 'markers'.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Elimina los marcadore del mapa, pero se mantienen almacenados.
function clearMarkers() {
  setMapOnAll(null);
}

// Muestra todos los marcadores.
function showMarkers() {
  setMapOnAll(map);
}

// Elimina los marcadores.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

// A partir de un objeto de clase marker, el metodo devuelve un objeto de clase latLng.
function markerToLatLng(marker) {
  var LatLng = marker.getPosition();
  return LatLng;
}

// A partir de un objeto de clase latLng, el metodo devuelve un objeto point.
function latLngToPoint(latLng) {
  point = {
    lat: latLng.lat(),
    lng: latLng.lng()
  }
  return point;
}

// Coloca un marcador en el mapa.
function singlePointQuery(){
    listener = map.addListener('click', function(event) {
      deleteMarkers();
      addMarker(event.latLng);
      points = markers.map(markerToLatLng);
  });
}

/* 
Forma un 'camino' a partir de una serie de puntos en el mapa, las 
coordenadas de los distintos puntos se almacenan en el arreglo 'Caminos'.
*/
function polylineQuery() {
  Caminos = new google.maps.Polyline({
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2
  });
  Caminos.setMap(map);
  listener = map.addListener('click', addPos); 
}

// Almacena una nueva coordenada (posicion) en el arreglo 'Caminos'.
function addPos(event) {
  if (contadorPuntos < maxPoints){
    var path = Caminos.getPath();

    path.push(event.latLng);

    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    contadorPuntos++;
  }
}

// Elimina la ultima coordenada almacenada en el arreglo 'Caminos'.
function removePos() {
  Caminos.getPath().pop();
  if (contadorPuntos > 0)
    contadorPuntos--;
}

// Guarda un punto y pasa clickea el boton next
function guardarPunto() {
  points = Caminos.getPath().getArray().map(latLngToPoint);
  Qualtrics.SurveyEngine.setEmbeddedData('Puntos', 
  points[contadorPuntos - 1].lat.toString() + ',' + points[contadorPuntos - 1].lng.toString());
}

// Determinar nombre del lugar a partir del coordenadas.
function geocodeLatLng(geocoder, map, input) {
  var latlngStr = input.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        console.log(results[1].formatted_address);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

