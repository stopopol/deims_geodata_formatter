<?php

namespace Drupal\deims_plotly_formatter\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Plugin implementation of the 'DeimsGeodataFormatter' formatter.
 *
 * @FieldFormatter(
 *   id = "deims_geodata_formatter",
 *   label = @Translation("DEIMS Geodata Formatter"),
 *   field_types = {
 *     "text",
 *     "text_long",
 *     "string",
 *   },
 *   quickedit = {
 *     "editor" = "disabled"
 *   }
 * )
 */
 
class DeimsGeodataFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
 
	public function settingsSummary() {
		$summary = [];
		$summary[] = $this->t('Queries and visualises site geodata');
		return $summary;
	}

	/**
	  * {@inheritdoc}
	  */
	public function viewElements(FieldItemListInterface $items, $langcode) {
		$elements = [];
		// Render each element as markup in case of multi-values.

		foreach ($items as $delta => $item) {
			  
			$record_uuid = $item->value;
			$nodes = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties(['uuid' => $record_uuid]);

			if (!empty($nodes)) {
				foreach ($nodes as $node) {
					$coordinates = $node->get('field_coordinates')->value;
					$boundaries = $node->get('field_boundaries');
			
					// load all nodes that have referenced this node
					$related_locations_ids = \Drupal::entityQuery('node')->condition('field_related_site',$node->id())->execute()
					$related_locations = \Drupal\node\Entity\Node::loadMultiple($related_locations_ids);
					
					// subsites
					$related_subsite_ids = \Drupal::entityQuery('node')->condition('field_subsite_name',$node->id())->execute()
					
					
					foreach ($related_locations as $location) {
						if ($location->isPublished()) {
							$location_information = [];
							$content_type = $node->bundle();
							
							if ($content_type == 'observation_location') {
								continue;
							}
						}
										
					$elements[$delta] = [
						'#markup' => '<div id="site_map_' . $record_uuid . '"></div>',
						'#attached' => array(
							'library'=> array('deims_geodata_formatter/deims-geodata-formatter'),
							'drupalSettings' => array(
								'deims_geodata_formatter' => array(
									'data_object' => array(
										'deimsid' => $record_uuid,
										'annual_avg_air_temperature' => $annual_avg_air_temperature,
										'air_temperature_values' => $air_temperature_values,
										'air_precipitation_values' => $precipitation_values,
										'reference_period' => $reference_period,
									),
								)
							),
						),
						
					];
				}
			}
		}

		return $elements;

    }

}
