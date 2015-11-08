var map;
var place_curr;
var place_dest;

var markers_currLoc= [];
var markers_destLoc= [];
var circle_currLoc =[];
var circle_destLoc =[];


(function($) {

	/**
	 * Generate an indented list of links from a nav. Meant for use with panel().
	 * @return {jQuery} jQuery object.
	 */
	$.fn.navList = function() {

		var	$this = $(this);
			$a = $this.find('a'),
			b = [];

		$a.each(function() {

			var	$this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' +
					'class="link depth-' + indent + '"' +
					( (typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
					( (typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
					'<span class="indent-' + indent + '"></span>' +
					$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Panel-ify an element.
	 * @param {object} userConfig User middlewares.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function(userConfig) {

		// No elements?
			if (this.length == 0)
				return $this;

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).panel(userConfig);

				return $this;

			}

		// Vars.
			var	$this = $(this),
				$body = $('body'),
				$window = $(window),
				id = $this.attr('id'),
				config;

		// Config.
			config = $.extend({

				// Delay.
					delay: 0,

				// Hide panel on link click.
					hideOnClick: false,

				// Hide panel on escape keypress.
					hideOnEscape: false,

				// Hide panel on swipe.
					hideOnSwipe: false,

				// Reset scroll position on hide.
					resetScroll: false,

				// Reset forms on hide.
					resetForms: false,

				// Side of viewport the panel will appear.
					side: null,

				// Target element for "class".
					target: $this,

				// Class to toggle.
					visibleClass: 'visible'

			}, userConfig);

			// Expand "target" if it's not a jQuery object already.
				if (typeof config.target != 'jQuery')
					config.target = $(config.target);

		// Panel.

			// Methods.
				$this._hide = function(event) {

					// Already hidden? Bail.
						if (!config.target.hasClass(config.visibleClass))
							return;

					// If an event was provided, cancel it.
						if (event) {

							event.preventDefault();
							event.stopPropagation();

						}

					// Hide.
						config.target.removeClass(config.visibleClass);

					// Post-hide stuff.
						window.setTimeout(function() {

							// Reset scroll position.
								if (config.resetScroll)
									$this.scrollTop(0);

							// Reset forms.
								if (config.resetForms)
									$this.find('form').each(function() {
										this.reset();
									});

						}, config.delay);

				};

			// Vendor fixes.
				$this
					.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
					.css('-webkit-overflow-scrolling', 'touch');

			// Hide on click.
				if (config.hideOnClick) {

					$this.find('a')
						.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

					$this
						.on('click', 'a', function(event) {

							var $a = $(this),
								href = $a.attr('href'),
								target = $a.attr('target');

							if (!href || href == '#' || href == '' || href == '#' + id)
								return;

							// Cancel original event.
								event.preventDefault();
								event.stopPropagation();

							// Hide panel.
								$this._hide();

							// Redirect to href.
								window.setTimeout(function() {

									if (target == '_blank')
										window.open(href);
									else
										window.location.href = href;

								}, config.delay + 10);

						});

				}

			// Event: Touch stuff.
				$this.on('touchstart', function(event) {

					$this.touchPosX = event.originalEvent.touches[0].pageX;
					$this.touchPosY = event.originalEvent.touches[0].pageY;

				});

				$this.on('touchmove', function(event) {

					if ($this.touchPosX === null
					||	$this.touchPosY === null)
						return;

					var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
						diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
						th = $this.outerHeight(),
						ts = ($this.get(0).scrollHeight - $this.scrollTop());

					// Hide on swipe?
						if (config.hideOnSwipe) {

							var result = false,
								boundary = 20,
								delta = 50;

							switch (config.side) {

								case 'left':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
									break;

								case 'right':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
									break;

								case 'top':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
									break;

								case 'bottom':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
									break;

								default:
									break;

							}

							if (result) {

								$this.touchPosX = null;
								$this.touchPosY = null;
								$this._hide();

								return false;

							}

						}

					// Prevent vertical scrolling past the top or bottom.
						if (($this.scrollTop() < 0 && diffY < 0)
						|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

							event.preventDefault();
							event.stopPropagation();

						}

				});

			// Event: Prevent certain events inside the panel from bubbling.
				$this.on('click touchend touchstart touchmove', function(event) {
					event.stopPropagation();
				});

			// Event: Hide panel if a child anchor tag pointing to its ID is clicked.
				$this.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.removeClass(config.visibleClass);

				});

		// Body.

			// Event: Hide panel on body click/tap.
				$body.on('click touchend', function(event) {
					$this._hide(event);
				});

			// Event: Toggle.
				$body.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.toggleClass(config.visibleClass);

				});

		// Window.

			// Event: Hide on ESC.
				if (config.hideOnEscape)
					$window.on('keydown', function(event) {

						if (event.keyCode == 27)
							$this._hide(event);

					});

		return $this;

	};

	/**
	 * Apply "placeholder" attribute polyfill to one or more forms.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function() {

		// Browser natively supports placeholders? Bail.
			if (typeof (document.createElement('input')).placeholder != 'undefined')
				return $(this);

		// No elements?
			if (this.length == 0)
				return $this;

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).placeholder();

				return $this;

			}

		// Vars.
			var $this = $(this);

		// Text, TextArea.
			$this.find('input[type=text],textarea')
				.each(function() {

					var i = $(this);

					if (i.val() == ''
					||  i.val() == i.attr('placeholder'))
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('blur', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == '')
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('focus', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == i.attr('placeholder'))
						i
							.removeClass('polyfill-placeholder')
							.val('');

				});

		// Password.
			$this.find('input[type=password]')
				.each(function() {

					var i = $(this);
					var x = $(
								$('<div>')
									.append(i.clone())
									.remove()
									.html()
									.replace(/type="password"/i, 'type="text"')
									.replace(/type=password/i, 'type=text')
					);

					if (i.attr('id') != '')
						x.attr('id', i.attr('id') + '-polyfill-field');

					if (i.attr('name') != '')
						x.attr('name', i.attr('name') + '-polyfill-field');

					x.addClass('polyfill-placeholder')
						.val(x.attr('placeholder')).insertAfter(i);

					if (i.val() == '')
						i.hide();
					else
						x.hide();

					i
						.on('blur', function(event) {

							event.preventDefault();

							var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

							if (i.val() == '') {

								i.hide();
								x.show();

							}

						});

					x
						.on('focus', function(event) {

							event.preventDefault();

							var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

							x.hide();

							i
								.show()
								.focus();

						})
						.on('keypress', function(event) {

							event.preventDefault();
							x.val('');

						});

				});

		// Events.
			$this
				.on('submit', function() {

					$this.find('input[type=text],input[type=password],textarea')
						.each(function(event) {

							var i = $(this);

							if (i.attr('name').match(/-polyfill-field$/))
								i.attr('name', '');

							if (i.val() == i.attr('placeholder')) {

								i.removeClass('polyfill-placeholder');
								i.val('');

							}

						});

				})
				.on('reset', function(event) {

					event.preventDefault();

					$this.find('select')
						.val($('option:first').val());

					$this.find('input,textarea')
						.each(function() {

							var i = $(this),
								x;

							i.removeClass('polyfill-placeholder');

							switch (this.type) {

								case 'submit':
								case 'reset':
									break;

								case 'password':
									i.val(i.attr('defaultValue'));

									x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

									if (i.val() == '') {
										i.hide();
										x.show();
									}
									else {
										i.show();
										x.hide();
									}

									break;

								case 'checkbox':
								case 'radio':
									i.attr('checked', i.attr('defaultValue'));
									break;

								case 'text':
								case 'textarea':
									i.val(i.attr('defaultValue'));

									if (i.val() == '') {
										i.addClass('polyfill-placeholder');
										i.val(i.attr('placeholder'));
									}

									break;

								default:
									i.val(i.attr('defaultValue'));
									break;

							}
						});

				});

		return $this;

	};

	/**
	 * Moves elements to/from the first positions of their respective parents.
	 * @param {jQuery} $elements Elements (or selector) to move.
	 * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
	 */
	$.prioritize = function($elements, condition) {

		var key = '__prioritize';

		// Expand $elements if it's not already a jQuery object.
			if (typeof $elements != 'jQuery')
				$elements = $($elements);

		// Step through elements.
			$elements.each(function() {

				var	$e = $(this), $p,
					$parent = $e.parent();

				// No parent? Bail.
					if ($parent.length == 0)
						return;

				// Not moved? Move it.
					if (!$e.data(key)) {

						// Condition is false? Bail.
							if (!condition)
								return;

						// Get placeholder (which will serve as our point of reference for when this element needs to move back).
							$p = $e.prev();

							// Couldn't find anything? Means this element's already at the top, so bail.
								if ($p.length == 0)
									return;

						// Move element to top of parent.
							$e.prependTo($parent);

						// Mark element as moved.
							$e.data(key, $p);

					}

				// Moved already?
					else {

						// Condition is true? Bail.
							if (condition)
								return;

						$p = $e.data(key);

						// Move element back to its original location (using our placeholder).
							$e.insertAfter($p);

						// Unmark element as moved.
							$e.removeData(key);

					}

			});

	};

})(jQuery);

//Date picker for every date picking event

$(document).ready(function() {
	$("#datepicker").datepicker({ minDate: 0, dateFormat: 'dd/mm/yy'  });
	$("button").click(function() {
		var selected = $("#downpicker option:selected").text();
		var datepicker = $("#datepicker").val();

	});
});

//Fix of a zoom-in/zoom-out of datepicker

$(window).on('resize orientationchange', function (e) {
	if ($.datepicker._datepickerShowing) {
		var datepicker = $.datepicker._curInst;
		dpInput = datepicker.input;
		dpElem = datepicker.dpDiv;
		dpElem.position({
			my: 'left top',
			of: dpInput,
			at: 'left bottom'
		});
	}
});


// More options on ask-ride page.

$(document).ready(function() {
	$( "#accordion" ).accordion({
		heightStyle: "content",
		collapsible: true,
		active: false

	});

	$( "#accordion2" ).accordion({
		heightStyle: "content",
		collapsible: true,
		active: false

	});
});



// Google autocomplete for places and Map
function google_maps() {

	var options = {
		types: ['(cities)'],
		componentRestrictions: {country: "can"}
	};

	var curr_input = document.getElementById('currentLocation');
	var dest_input = document.getElementById('destination');
	var autocompleteCurr = new google.maps.places.Autocomplete(curr_input, options);
	var autocompleteDest = new google.maps.places.Autocomplete(dest_input, options);



	var mapProp = {

		center:new google.maps.LatLng( 46, -73),
		zoom:8,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	map=new google.maps.Map(document.getElementById("googleMap"), mapProp);
	google.maps.event.trigger(map, 'resize');

	autocompleteCurr.bindTo('bounds', map);

	var infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
		map: map,
		anchorPoint: new google.maps.Point(0, -29)
	});

	google.maps.event.addListener(autocompleteCurr, 'place_changed', function() {

		place_curr =  autocompleteCurr.getPlace();
		infowindow.close();
		marker.setVisible(false);
		var place = autocompleteCurr.getPlace();

		if (!place.geometry) {
			return;
		}


		if (place.geometry.viewport) {

			map.setCenter(place.geometry.location);
			map.setZoom(15);
		}


		marker.setIcon(/** @type {google.maps.Icon} */({
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(35, 35)
		}));
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);

		/*var address = '';
		if (place.address_components) {
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			].join(' ');
		}

		infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
		infowindow.open(map, marker);*/
	});


	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng, map);


	});

	google.maps.event.addListener(autocompleteDest, 'place_changed', function() {
		place_dest =  autocompleteDest.getPlace();
	});




}

function placeMarker(location,map) {

	var marker_arr = markers_currLoc;
	var icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';


	if(document.getElementById('radio-map-destination').checked) {
		marker_arr = markers_destLoc;
		icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
	}


	if (marker_arr.length > 0)deleteMarkers();
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		draggable: true,
		icon: icon
	});

	marker_arr.push(marker);
	map.panTo(position);


}

function deleteMarkers() {


	var marker_arr = markers_currLoc;
	var circle_arr = circle_currLoc;

	if(document.getElementById('radio-map-destination').checked) {
		marker_arr = markers_destLoc;
		circle_arr = circle_destLoc;
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
	}



}

//Draws a radius on Google Map.

function drawRadius(){

	var marker_arr = markers_currLoc;
	var circle_arr = circle_currLoc;
	var color = "#00FF00";

	if(document.getElementById('radio-map-destination').checked) {
		marker_arr = markers_destLoc;
		circle_arr = circle_destLoc;
		color = "#FF0000";
	}

	var km =  document.getElementById('radius').value;

	if(km > 1000)km=1000;
	if(circle_arr.length>0){
		for (i in circle_arr) {
			circle_arr[i].setMap(null);
		}
		circle_arr.length = 0;

	}

	//for (marker in markers_currLoc) {
	for(i=0; i < marker_arr.length;i++){
		// Add the circle for this city to the map.
		var circle = new google.maps.Circle({
			map: map,
			radius: km*1,    // 10 miles in metres
			fillColor: color
		});

		circle_arr.push(circle);
		circle.bindTo('center', marker_arr[i], 'position');

	}

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

//Prevents submitting the form by pressing on enter.
$('.preventEnter').on('keyup keypress', function(e) {
	var code = e.keyCode || e.which;
	if (code == 13) {
		e.preventDefault();
		return false;
	}
});

$('#currentLocationMap').click(function() {

	var curr_input = document.getElementById('currentLocation');
	if(curr_input.value.length == 0)return;

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



});


$('#destinationMap').click(function() {

	var dest_input = document.getElementById('destination');

	if(dest_input.value.length == 0)return;

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

});



//Makes sure that no letters are entered in the cost text box
$("#costInput").keyup(function() {
	$("#costInput").val(this.value.match(/[0-9]*/));
});

//The clockpicker for time picking events

$('.clockpicker').clockpicker()
	.find('input').change(function(){
		console.log(this.value);
	});


//Fade-in/Fade out of the nessage "I am a driver/passenger" when posting a travel

$(document).ready(function(){

	$(".passengerOpt").click(function(){
		$(".fadeinAction").fadeIn("slow");
		$(".passengerOptions").fadeIn("slow");
		//$( '.googleMap' ).delay( 1000 ).fadeIn( 'slow' );
		$(".passengerOpt").fadeOut();
		$(".driversOpt").fadeOut();
		$("#passengerCheckbox").prop("checked", true);
		$("#driverCheckbox").prop("checked", false);

		google_maps();


	});
	$(".driversOpt").click(function(){
		$(".fadeinAction").fadeIn("slow");
		$(".driverOptions").fadeIn("slow");
		//$( '.googleMap' ).delay( 1000 ).fadeIn( 'slow' );
		$(".passengerOpt").fadeOut();
		$(".driversOpt").fadeOut();
		$("#driverCheckbox").prop("checked", true);
		$("#passengerCheckbox").prop("checked", false);
		google_maps();

	});


});



//Spinner button for seats available etc...

$(function() {
	var spinner = $( "#spinner" ).spinner({min: 1, max: 10});
	$( "button" ).button();
});



// This is to prevent 2 checkboxes to be checked at the same time.


$("input:checkbox").on('click', function(e) {
	// in the handler, 'this' refers to the box clicked on
	var $box = $(this);
	if ($box.is(":checked")) {

		// the name of the box is retrieved using the .attr() method
		// as it is assumed and expected to be immutable
		var group = "input:checkbox[class='" + $box.attr("class") + "']";
		// the checked state of the group/box on the other hand will change
		// and the current value is retrieved using .prop() method
		$(group).prop("checked", false);
		$box.prop("checked", true);


	} else {
		e.preventDefault();
		return false;

	}
});

//Disable the Passenger button so it won't be unselected

$('#passengerCheckbox').click(function() {
	//check if checkbox is checked

	if ($(this).is(':checked')) {
		$(".driverOptions").hide();
		$(".passengerOptions").fadeIn("slow");

	}


});

//Disable the driver button so it won't be unselected, and fades out passenger options and
//fades in the driver options

$('#driverCheckbox').click(function() {
	//check if checkbox is checked

	if ($(this).is(':checked')) {
		$(".passengerOptions").hide();
		$(".driverOptions").fadeIn("slow");

	}



});

