<?php

namespace Drupal\deims_geodata_formatter\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\geofield\GeoPHP\GeoPHPInterface;

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
					
					$coordinates = json_decode(\Drupal::service('geofield.geophp')->load($node->get('field_coordinates')->value)->out('json'));
					$boundaries = json_decode(\Drupal::service('geofield.geophp')->load($node->get('field_boundaries')->value)->out('json'));
					
			
					// load all locations that have referenced this node
					$related_locations_query = \Drupal::entityQuery('node');
					$related_locations_query->condition('field_related_site',$node->id());
					$related_locations_query->condition('type', 'observation_location');
					$related_locations_ids = $related_locations_query->execute();
					$related_locations = \Drupal\node\Entity\Node::loadMultiple($related_locations_ids);					
					
					// subsites
					$related_subsites_query = \Drupal::entityQuery('node');
					$related_subsites_query->condition('field_parent_site',$node->id());
					$related_subsites_query->condition('type', 'site');
					$related_subsites_ids = $related_subsites_query->execute();
					$related_subsites = \Drupal\node\Entity\Node::loadMultiple($related_subsites_ids);
					
					$all_related_locations = array();
					$all_related_subsites = array();
					
					foreach ($related_locations as $location) {
						// do stuff for every location
						$location_title = $location->get('title')->value;
						$location_uuid = $location->get('uuid')->value;
						//$location_geometry = $location->get('field_boundaries')->value;
						//$location_geometry = $location->get('field_boundaries');
						$location_geometry = json_decode(\Drupal::service('geofield.geophp')->load($location->get('field_boundaries')->value)->out('json'));
						foreach ($location->get('field_location_type')->referencedEntities() as $location_entity) {
							// should be changed to the URI as soon as the envthes is ready
							$location_type = $location_entity->label();
						}
						
						if (!$location->get('field_boundaries')->isEmpty()) {
							$location_geometry = json_decode(\Drupal::service('geofield.geophp')->load($location->get('field_boundaries')->value)->out('json'));
							array_push($all_related_locations, array($location_title, $location_uuid, $location_geometry, $location_type));
						}
						
						
					}
					
					foreach ($related_subsites as $subsite) {
						// do stuff for every subsite
						$subsite_title = $subsite->get('title')->value;
						$subsite_uuid = $subsite->get('uuid')->value;
						if (!$subsite->get('field_boundaries')->isEmpty()) {
							$subsite_geometry = json_decode(\Drupal::service('geofield.geophp')->load($subsite->get('field_boundaries')->value)->out('json'));
							array_push($all_related_subsites, array($subsite_title, $subsite_uuid, $subsite_geometry));
						}
						
					}
					
					$output_test = json_encode(array_merge($all_related_locations, $all_related_subsites));
					
					
					// setting css class is not working
					$elements[$delta] = [
						'#markup' => '<div id="site_record_map" class="map-height" style="height: 400px;"></div>' ,
						'#attached' => array(
							'library'=> array('deims_geodata_formatter/deims-geodata-formatter'),
							'drupalSettings' => array(
								'deims_geodata_formatter' => array(
									'data_object' => array(
										'coordinates' => $coordinates,
										'boundaries' => $boundaries,
										'related_locations' => $all_related_locations,
										'related_subsites' => $all_related_subsites,
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
