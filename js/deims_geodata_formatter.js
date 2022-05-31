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
				
				var map = L.map('site_record_map', {
					center: [51.505, -0.09],
					zoom: 13
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
				}
				
				
				
				var coordinates_layer = L.geoJSON().addTo(map);
				
				var locations_layer = L.geoJSON().addTo(map);
				var subsites_layer = L.geoJSON().addTo(map);
				
				
		
				for (let i = 0; i < subsites.length; i++) {
					subsites_layer.addData(subsites[i][2]);
				}
				
				for (let i = 0; i < locations.length; i++) {
					locations_layer.addData(locations[i][2]);
				}
				
				if (coordinates) {
					coordinates_layer.addData(coordinates);
				}
				
				
				
				else {
					
				}
				
				
			});
			
		}
	};
})(jQuery, Drupal, once);