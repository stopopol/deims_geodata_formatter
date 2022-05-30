(function ($, Drupal, once) {
	Drupal.behaviors.deims_geodata_formatter = {
		attach: function (context, settings) {

			var input_data = drupalSettings.deims_geodata_formatter.data_object;
	
			$(context).find("#site_record_map").once("#site_record_map").each(function () {
				console.log('behaviour test');
				var map = L.map('site_record_map', {
					center: [51.505, -0.09],
					zoom: 13
				});
			});
			
		}
	};
})(jQuery, Drupal, once);