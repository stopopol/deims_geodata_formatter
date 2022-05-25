<?php

namespace Drupal\deims_geodata_formatter\Plugin\Field\FieldFormatter;

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
					$boundaries = $node->get('field_boundaries')->value;
			
					// load all locations that have referenced this node
					$related_locations_query = \Drupal::entityQuery('node');
					$related_locations_query->condition('field_related_site',$node->id());
					$related_locations_query->condition('type', 'observation_location');
					$related_locations_ids = $related_locations_query->execute();
					$related_locations = \Drupal\node\Entity\Node::loadMultiple($related_locations_ids);					
					
					// subsites
					$related_subsites_query = \Drupal::entityQuery('node');
					$related_subsites_query->condition('field_subsite_name',$node->id());
					$related_subsites_query->condition('type', 'observation_location');
					$related_subsites_ids = $related_subsites_query->execute();
					$related_subsites = \Drupal\node\Entity\Node::loadMultiple($related_subsites_ids);
					
					$all_related_locations = array();
					$all_related_subsites = array();
					
					foreach ($related_locations as $location) {
						// do stuff for every location
						$location_title = $locations->get('title')->value;
						$location_uuid = $locations->get('uuid')->value;
						$location_geometry = $locations->get('field_boundaries')->value;
						
						array_push($all_related_locations, $location_title, $location_uuid, $location_geometry);
					}
					
					foreach ($related_subsites as $subsite) {
						// do stuff for every subsite
						$subsite_title = $subsite->get('title')->value;
						$subsite_uuid = $subsite->get('uuid')->value;
						$subsite_geometry = $subsite->get('field_boundaries')->value;
						
						array_push($all_related_subsites, $subsite_title, $subsite_uuid, $subsite_geometry);
					}
					
					
					$elements[$delta] = [
						'#markup' => '<div id="site_map_' . json_encode(array_merge($all_related_locations, $all_related_subsites)) . '"></div>',
						/*'#attached' => array(
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
						), */
						
					];
				}
			}
		}

		return $elements;

    }

}
