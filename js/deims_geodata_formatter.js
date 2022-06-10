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
				
				if (coordinates) {
					var center = [coordinates['coordinates']['1'], coordinates['coordinates']['0']];
				}
				else {
					var center = [0, 0];
				}
				
				var map = L.map('site_record_map', {
					center: center,
					attributionControl: false,
					zoom: 5,
					layers: []
				});
				var layerControl = L.control.layers().addTo(map);
				
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '© OpenStreetMap'
				}).addTo(map);
				
				function onEachFeature(feature, layer) {
					// does this feature have a property named popupContent?
					if (feature.properties && feature.properties.popupContent) {
						layer.bindPopup(feature.properties.popupContent);
					}
				}
				
				map.invalidateSize();
				
				var stroke_width = 3;
				var dasharray_width = "7";
				
				var boundaries_style = {
					"color": "#FFFFFF",
					"fillColor": "#ff9933",
					"fillOpacity": 0.75,
					"weight": stroke_width,
				};
				
				var subsites_style = {
					"color": "#ff6633",
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
							
				var sampling_area_style = {
					"color": "#336600",
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var airshed_style = {
					"color": "#6699cc",
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var equipment_location_style = {
					"color": "#999999",
					"weight": stroke_width,
					"fillColor": "#ffffff00"
				};
				
				var eshape_style = {
					"color": "#cc0066",
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var hydrological_catchment_style = {
					"color": "#3399FF",
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var other_style = {
					"color": "#996633",
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var model_area_style = {
					"color": "#666699",
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};

				var socio_ecological_style = {
					"color": "#cc3333",
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				if (boundaries) {
					var boundaries_layer = L.geoJSON(boundaries, {style: boundaries_style}).addTo(map);
					map.fitBounds(boundaries_layer.getBounds());
					//layerControl.addOverlay(boundaries_layer, "Boundaries");
				}
				
				if (subsites.length > 0) {
					var subsites_layer = L.geoJSON(null,{style: subsites_style, onEachFeature: onEachFeature}).addTo(map);
					layerControl.addOverlay(subsites_layer, "Subsite(s)");
					for (let i = 0; i < subsites.length; i++) {
						var geojsonFeature = {
							"type": "Feature",
							"properties": {
								"popupContent": '<a href="/' + subsites[i][1] + '">' + subsites[i][0] + '</a><br>Type: Subsite',
							},
							"geometry": subsites[i][2]
						};
						subsites_layer.addData(geojsonFeature);
					}
				}
				
				if (locations.length > 0) {
									
					var air_shed_layer = L.geoJSON(null,{style: airshed_style, onEachFeature: onEachFeature});
					var equipment_location_layer = L.geoJSON(null,{style: equipment_location_style, onEachFeature: onEachFeature});
					var hydrological_catchment_layer = L.geoJSON(null,{style: hydrological_catchment_style, onEachFeature: onEachFeature});
					var model_area_layer = L.geoJSON(null,{style: model_area_style, onEachFeature: onEachFeature});
					var sampling_area_layer = L.geoJSON(null,{style: sampling_area_style, onEachFeature: onEachFeature});
					var socio_ecological_layer = L.geoJSON(null,{style: socio_ecological_style, onEachFeature: onEachFeature});
					var e_shape_layer = L.geoJSON(null,{style: eshape_style, onEachFeature: onEachFeature});
					var other_layer = L.geoJSON(null,{style: other_style, onEachFeature: onEachFeature});
					
					for (let i = 0; i < locations.length; i++) {
						
						var popup_text = '<a href="/locations/' + locations[i][1] + '">' + locations[i][0] + '</a>';
						if (locations[i][3]) {
							popup_text += '<br>Type: ' + locations[i][3];
						}
						
						var geojsonFeature = {
							"type": "Feature",
							"properties": {
								"popupContent": popup_text
							},
							"geometry": locations[i][2]
						};
						
						switch(locations[i][3]) {
							
							case "Air Shed":
								if (map.hasLayer(air_shed_layer) == false) {
									air_shed_layer.addTo(map);
									layerControl.addOverlay(air_shed_layer, "Air Shed");
								};
								air_shed_layer.addData(geojsonFeature);
								break;
							case "Equipment Location":
								if (map.hasLayer(equipment_location_layer) == false) {
									equipment_location_layer.addTo(map);
									layerControl.addOverlay(equipment_location_layer, "Equipment Location(s)");
								}
								equipment_location_layer.addData(geojsonFeature);
								break;
							case "Hydrological Catchment":
								if (map.hasLayer(hydrological_catchment_layer) == false) {
									hydrological_catchment_layer.addTo(map);
									layerControl.addOverlay(hydrological_catchment_layer, "Hydrological Catchment Area");
								}
								hydrological_catchment_layer.addData(geojsonFeature);
								break;
							case "Model Area":
								if (map.hasLayer(model_area_layer) == false) {
									model_area_layer.addTo(map);
									layerControl.addOverlay(model_area_layer, "Model Area(s)");
								}
								model_area_layer.addData(geojsonFeature);
								break;
							case "Sampling Area":
								if (map.hasLayer(sampling_area_layer) == false) {
									sampling_area_layer.addTo(map);
									layerControl.addOverlay(sampling_area_layer, "Sampling Area(s)");
								}
								sampling_area_layer.addData(geojsonFeature);
								break;
							case "Socio-ecological reference area":
								if (map.hasLayer(socio_ecological_layer) == false) {
									socio_ecological_layer.addTo(map);
									layerControl.addOverlay(socio_ecological_layer, "Socio-ecological Reference Area(s)");
								}
								socio_ecological_layer.addData(geojsonFeature);
								break;
							case "e-shape":
								if (map.hasLayer(e_shape_layer) == false) {
									layerControl.addOverlay(e_shape_layer, '<svg height="20" width="160"><line x1="0" y1="20" x2="20" y2="0" style="stroke:#cc0066;stroke-width:2;" stroke-dasharray="4" />  <text x="30" y="15" fill="black" font-size="smaller">Remote Sensing Analysis Area</text></svg>');
								}
								e_shape_layer.addData(geojsonFeature);
								break;
							case "not applicable":
							default:
								if (map.hasLayer(other_layer) == false) {
									other_layer.addTo(map);
									layerControl.addOverlay(other_layer, "Other (non-classified) Location(s)");
								}
								other_layer.addData(geojsonFeature);
						}
						
					}
					
				}
				
				if (coordinates) {
						
					var coordinates_layer = L.geoJSON(coordinates);
					layerControl.addOverlay(coordinates_layer, "Centroid or Representative Coordinates");
					
					if (!boundaries) {
						coordinates_layer.addTo(map);
					}
					
				}

				if (boundaries) {
					boundaries_layer.bringToBack();
				}
				
				// to do:
				// white halo for line features?
				// legend
				// 
				
			});
			
		}
	};
})(jQuery, Drupal, once);
