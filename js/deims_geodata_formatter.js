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
				
				var eshape_colour = "#cc0066";
				var hydrological_colour = "#3399FF";
				var boundaries_colour = "#FFFFFF";
				var subsites_colour = "#ff6633";
				var sampling_colour = "#336600";
				var airshed_colour = "#6699cc";
				var equipment_colour = "#999999";
				var other_colour = "#996633";
				var model_colour = "#666699";
				var socioecology_colour = "#cc3333";
						
				function print_legend_symbol(colour_code, label, stroke_dasharray_value) {
					return '<svg height="20" width="160"><line x1="0" y1="20" x2="20" y2="0" style="stroke:' + colour_code + ';stroke-width:' + stroke_width + ' ;" stroke-dasharray="' + stroke_dasharray_value + '" />  <text x="25" y="15" fill="black" font-size="smaller">' + label + '</text></svg>';
				}
				
				
				var boundaries_style = {
					"color": boundaries_colour,
					"fillColor": "#ff9933",
					"fillOpacity": 0.75,
					"weight": stroke_width,
				};
				
				var subsites_style = {
					"color": subsites_colour,
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
							
				var sampling_area_style = {
					"color": sampling_colour,
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var airshed_style = {
					"color": airshed_colour,
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var equipment_location_style = {
					"color": equipment_colour,
					"weight": stroke_width,
					"fillColor": "#ffffff00"
				};
				
				var eshape_style = {
					"color": eshape_colour,
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var hydrological_catchment_style = {
					"color": hydrological_colour,
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var other_style = {
					"color": other_colour,
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};
				
				var model_area_style = {
					"color": model_colour,
					"weight": stroke_width,
					"dashArray": dasharray_width,
					"fillColor": "#ffffff00"
				};

				var socio_ecological_style = {
					"color": socioecology_colour,
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
					layerControl.addOverlay(subsites_layer, print_legend_symbol(subsites_colour, "Subsite(s)", dasharray_width));
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
							popup_text += '<br>Type: ' + locations[i][4];
						}
						
						var geojsonFeature = {
							"type": "Feature",
							"properties": {
								"popupContent": popup_text
							},
							"geometry": locations[i][2]
						};
						
						switch(locations[i][3]) {
							
							case "http://vocabs.lter-europe.net/elter_cl/10490":
								if (map.hasLayer(air_shed_layer) == false) {
									air_shed_layer.addTo(map);
									layerControl.addOverlay(air_shed_layer, print_legend_symbol(airshed_colour, "Airshed Area(s)", dasharray_width));
								};
								air_shed_layer.addData(geojsonFeature);
								break;
							case "http://vocabs.lter-europe.net/elter_cl/10491":
								if (map.hasLayer(equipment_location_layer) == false) {
									equipment_location_layer.addTo(map);
									layerControl.addOverlay(equipment_location_layer, print_legend_symbol(equipment_colour, "Equipment Area(s)", 0));
								}
								equipment_location_layer.addData(geojsonFeature);
								break;
							case "http://vocabs.lter-europe.net/elter_cl/10492":
								if (map.hasLayer(hydrological_catchment_layer) == false) {
									hydrological_catchment_layer.addTo(map);
									layerControl.addOverlay(hydrological_catchment_layer, print_legend_symbol(hydrological_colour, "Hydrological Catchment Area(s)", dasharray_width));
								}
								hydrological_catchment_layer.addData(geojsonFeature);
								break;
							case "http://vocabs.lter-europe.net/elter_cl/10493":
								if (map.hasLayer(model_area_layer) == false) {
									model_area_layer.addTo(map);
									layerControl.addOverlay(model_area_layer, print_legend_symbol(model_colour, "Model Area(s)", dasharray_width));
								}
								model_area_layer.addData(geojsonFeature);
								break;
							case "http://vocabs.lter-europe.net/elter_cl/10494":
								if (map.hasLayer(sampling_area_layer) == false) {
									sampling_area_layer.addTo(map);
									layerControl.addOverlay(sampling_area_layer, print_legend_symbol(sampling_colour, "Sampling Area(s)", dasharray_width));
								}
								sampling_area_layer.addData(geojsonFeature);
								break;
							case "http://vocabs.lter-europe.net/elter_cl/10495":
								if (map.hasLayer(socio_ecological_layer) == false) {
									socio_ecological_layer.addTo(map);
									layerControl.addOverlay(socio_ecological_layer, print_legend_symbol(socioecology_colour, "Socio-ecological Reference Area(s)", dasharray_width));
								}
								socio_ecological_layer.addData(geojsonFeature);
								break;
							case "http://vocabs.lter-europe.net/elter_cl/10496":
								if (map.hasLayer(e_shape_layer) == false) {
									e_shape_layer.addTo(map);
									layerControl.addOverlay(e_shape_layer, print_legend_symbol(eshape_colour, "Remote Sensing Analysis Area(s)", dasharray_width));
								}
								e_shape_layer.addData(geojsonFeature);
								break;
							case "http://vocabs.lter-europe.net/elter_cl/10227":
							default:
								if (map.hasLayer(other_layer) == false) {
									other_layer.addTo(map);
									layerControl.addOverlay(other_layer, print_legend_symbol(other_colour, "Other (unclassified) Location(s)", dasharray_width));
								}
								other_layer.addData(geojsonFeature);
						}
						
					}
					
					// turn off particular layers by default
					if (map.hasLayer(e_shape_layer) == true) {
						map.removeLayer(e_shape_layer);
					}
					if (map.hasLayer(other_layer) == true) {
						map.removeLayer(other_layer);
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
				
			});
			
		}
	};
})(jQuery, Drupal, once);
