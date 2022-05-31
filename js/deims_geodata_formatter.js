(function ($, Drupal, once) {
	Drupal.behaviors.deims_geodata_formatter = {
		attach: function (context, settings) {

			var input_data = drupalSettings.deims_geodata_formatter.data_object;
			var locations = input_data["related_locations"]
			var subsites = input_data["related_subsites"]
			
			$(context).find("#site_record_map").once("#site_record_map").each(function () {
				
				var element = document.getElementById("site_record_map");
				element.style.height = "400px";
				
				var map = L.map('site_record_map', {
					center: [51.505, -0.09],
					zoom: 13
				});
				
				
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '© OpenStreetMap'
				}).addTo(map);
				
				map.invalidateSize();
				
				
				// add features to map
				//L.geoJSON(geojsonFeature).addTo(map);
				
			});
			
		}
	};
})(jQuery, Drupal, once);