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
				
				var stroke_width = 3;
				
				var boundaries_style = {
					"color": "#ff7800",
					"weight": stroke_width,
					"opacity": 0.65
				};
				
				var subsites_style = {
					"color": "#b15928",
					"weight": stroke_width,
					"fill": false
				};
				
				// should be the role model for other styles
				var sampling_area_style = {
					"color": "#336600",
					"weight": stroke_width,
					"fillColor": "#ffffff00"
				};
				
				var equipment_location_style = {
					"color": "#999999",
					"weight": stroke_width,
				};
				
				var eshape_style = {
					"color": "#cc0066",
					"weight": stroke_width,
					"dashArray": '5',
				};
				
				var hydrological_catchment_style = {
					"color": "#3399FF",
					"weight": stroke_width,
					"dashArray": '5',
					"fill": false
				};
				
				var other_style = {
					"color": "#cab2d6",
					"weight": stroke_width,
					"fill": false
				};

				if (boundaries) {
					var boundaries_layer = L.geoJSON(boundaries, {style: boundaries_style}).addTo(map);
					map.fitBounds(boundaries_layer.getBounds());
					layerControl.addOverlay(boundaries_layer, "Boundaries");
				}
				
				if (subsites.length > 0) {
					var subsites_layer = L.geoJSON(null,{style: subsites_style}).addTo(map);
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
					var equipment_location_layer = L.geoJSON(null,{style: equipment_location_style});
					var hydrological_catchment_layer = L.geoJSON(null,{style: hydrological_catchment_style});
					var model_area_layer = L.geoJSON(null,{style: boundaries_style});
					var sampling_area_layer = L.geoJSON(null,{style: sampling_area_style});
					var socio_ecological_layer = L.geoJSON(null,{style: boundaries_style});
					var e_shape_layer = L.geoJSON(null,{style: eshape_style});
					var other_layer = L.geoJSON(null,{style: other_style});
					
					for (let i = 0; i < locations.length; i++) {
						
						var popup_text = '<a href="https://www.deims.org/locations/' + locations[i][1] + '">' + locations[i][0] + '</a><br>Type: ' + locations[i][3];
						
						switch(locations[i][3]) {
							
							case "Air Shed":
								air_shed_check = true;
								var current_feature = air_shed_layer.addData(locations[i][2]);
								current_feature.bindPopup(popup_text);
								break;
							case "Equipment Location":
								equipment_location_check = true;
								var current_feature = equipment_location_layer.addData(locations[i][2]);
								current_feature.bindPopup(popup_text);
								break;
							case "Hydrological Catchment":
								hydrological_catchment_check = true;
								var current_feature = hydrological_catchment_layer.addData(locations[i][2]);
								current_feature.bindPopup(popup_text);
								break;
							case "Model Area":
								model_area_check = true;
								var current_feature = model_area_layer.addData(locations[i][2]);
								current_feature.bindPopup(popup_text);
								break;
							case "Sampling Area":
								sampling_area_check = true;
								var current_feature = sampling_area_layer.addData(locations[i][2]);
								current_feature.bindPopup(popup_text);
								break;
							case "Socio-ecological reference area":
								socio_ecological_check = true;
								var current_feature = socio_ecological_layer.addData(locations[i][2]);
								current_feature.bindPopup(popup_text);
								break;
							case "e-shape":
								e_shape_check = true;
								var current_feature = e_shape_layer.addData(locations[i][2]);
								current_feature.bindPopup(popup_text);
								break;
							case "not applicable":
							default:
								other_check = true;
								var current_feature = other_layer.addData(locations[i][2]);
								current_feature.bindPopup(popup_text);
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
						// turned off by default
						//e_shape_layer.addTo(map);
						layerControl.addOverlay(e_shape_layer, "Remote Sensing Analysis Area(s)");
					}
					
					if (other_check) {
						other_layer.addTo(map);
						layerControl.addOverlay(other_layer, "Other (non-classified) Location(s)");
					}
					
				}
				
				if (coordinates) {
						
					var coordinates_layer = L.geoJSON(coordinates);
					layerControl.addOverlay(coordinates_layer, "Centroid or Representative Coordinates");
					
					if (!boundaries) {
						coordinates_layer.addTo(map);
						map.flyTo(L.latLng(coordinates['coordinates']['1'], coordinates['coordinates']['0']), 5)
					}
					
				}

				if (boundaries) {
					boundaries_layer.bringToBack();
				}
				
				// to do:
				// styling
				// popups on click
				
			});
			
		}
	};
})(jQuery, Drupal, once);