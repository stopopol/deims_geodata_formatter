(function ($, Drupal, once) {
	Drupal.behaviors.deims_geodata_formatter = {
		attach: function (context, settings) {

			var input_data = drupalSettings.deims_geodata_formatter.data_object;

			var coordinates = input_data["coordinates"]
			var boundaries = input_data["boundaries"]
			var locations = input_data["related_locations"]
			var subsites = input_data["related_subsites"]
			

			$(context).find("#site_record_map").once("#site_record_map").each(function () {
				
				var element = document.getElementById("site_record_map");
				element.style.height = "400px";
				element.style.minWidth = "150px";
				
				var map = L.map('site_record_map', {
					center: [0, 0],
					zoom: 5,
					layers: []
				});
				var layerControl = L.control.layers().addTo(map);
				
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '© OpenStreetMap'
				}).addTo(map);
				
				map.invalidateSize();
				
				var boundaries_style = {
					"color": "#ff7800",
					"weight": 5,
					"opacity": 0.65
				};

				if (boundaries) {
					var boundaries_layer = L.geoJSON(boundaries, {style: boundaries_style}).addTo(map);
					map.fitBounds(boundaries_layer.getBounds());
					layerControl.addOverlay(boundaries_layer, "Boundaries");
				}
				
				if (subsites.length > 0) {
					var subsites_layer = L.geoJSON(null,{style: boundaries_style}).addTo(map);
					for (let i = 0; i < subsites.length; i++) {
						subsites_layer.addData(subsites[i][2]);
					}
					layerControl.addOverlay(subsites_layer, "Subsite(s)");
				}
				
				if (locations.length > 0) {
					
					var air_shed_check = false;
					var equipment_location_check = false;
					var hydrological_catchment_check = false;
					var model_area_check = false;
					var sampling_area_check = false;
					var socio_ecological_check = false;
					var e_shape_check = false;
					var other_check = false;
					
					var air_shed_layer = L.geoJSON(null,{style: boundaries_style});
					var equipment_location_layer = L.geoJSON(null,{style: boundaries_style});
					var hydrological_catchment_layer = L.geoJSON(null,{style: boundaries_style});
					var model_area_layer = L.geoJSON(null,{style: boundaries_style});
					var sampling_area_layer = L.geoJSON(null,{style: boundaries_style});
					var socio_ecological_layer = L.geoJSON(null,{style: boundaries_style});
					var e_shape_layer = L.geoJSON(null,{style: boundaries_style});
					var other_layer = L.geoJSON(null,{style: boundaries_style});
					
					var locations_layer = L.geoJSON().addTo(map);
					for (let i = 0; i < locations.length; i++) {
						
						switch(locations[i][3]) {
							case "Air Shed":
								air_shed_check = true;
								air_shed_layer.addData(locations[i][2]);
								break;
							case "Equipment Location":
								equipment_location_check = true;
								equipment_location_layer.addData(locations[i][2]);
								break;
							case "Hydrological Catchment":
								hydrological_catchment_check = true;
								hydrological_catchment_layer.addData(locations[i][2]);
								break;
							case "Model Area":
								model_area_check = true;
								model_area_layer.addData(locations[i][2]);
								break;
							case "Sampling Area":
								sampling_area_check = true;
								sampling_area_layer.addData(locations[i][2]);
								break;
							case "Socio-ecological reference area":
								socio_ecological_check = true;
								socio_ecological_layer.addData(locations[i][2]);
								break;
							case "e-shape":
								e_shape_check = true;
								e_shape_layer.addData(locations[i][2]);
								break;
							case "not applicable":
							default:
								other_check = true;
								other_layer.addData(locations[i][2]);
						}
						
					}
					
					if (air_shed_check) {
						air_shed_layer.addTo(map);
						layerControl.addOverlay(air_shed_layer, "Air Shed");
					}
					
					if (equipment_location_check) {
						equipment_location_layer.addTo(map);
						layerControl.addOverlay(equipment_location_layer, "Equipment Location(s)");
					}
					
					if (hydrological_catchment_check) {
						hydrological_catchment_layer.addTo(map);
						layerControl.addOverlay(hydrological_catchment_layer, "Hydrological Catchment Area");
					}
					
					if (model_area_check) {
						model_area_layer.addTo(map);
						layerControl.addOverlay(model_area_layer, "Equipment Location(s)");
					}
					
					if (sampling_area_check) {
						sampling_area_layer.addTo(map);
						layerControl.addOverlay(sampling_area_layer, "Sampling Area(s)");
					}
					
					if (socio_ecological_check) {
						socio_ecological_layer.addTo(map);
						layerControl.addOverlay(socio_ecological_layer, "Socio-ecological Reference Area(s)");
					}
					
					if (e_shape_check) {
						e_shape_check.addTo(map);
						layerControl.addOverlay(e_shape_check, "Remote Sensing Analysis Area(s)");
					}
					
					if (other_check) {
						other_layer.addTo(map);
						layerControl.addOverlay(other_layer, "Other (non-classified) Location(s)");
					}
					
				}
				
				if (coordinates) {
					
					var geojsonMarkerOptions = {
						radius: 8,
						fillColor: "#ff7800",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8
					};
					
					var coordinates_layer = L.geoJSON(coordinates);
					layerControl.addOverlay(coordinates_layer, "Centroid or Representative Coordinates");
					
					if (!boundaries) {
						coordinates_layer.addTo(map);
						map.flyTo(L.latLng(coordinates['coordinates']['1'], coordinates['coordinates']['0']), 5)
					}
					
				}

				// to do:
				// styling
				// popups on click
				// differentiate location types
				
			});
			
		}
	};
})(jQuery, Drupal, once);