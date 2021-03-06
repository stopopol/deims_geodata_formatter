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
					
					if (!$node->get('field_coordinates')->isEmpty()) {
						$coordinates = json_decode(\Drupal::service('geofield.geophp')->load($node->get('field_coordinates')->value)->out('json'));
					}
					else {
						$coordinates = null;
					}
					
					if (!$node->get('field_boundaries')->isEmpty()) {
						$boundaries = json_decode(\Drupal::service('geofield.geophp')->load($node->get('field_boundaries')->value)->out('json'));
					}
					else {
						$boundaries = null;
					}
					
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
						$location_geometry = json_decode(\Drupal::service('geofield.geophp')->load($location->get('field_boundaries')->value)->out('json'));
						$location_type = null;
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
					
					// there should always at least be coordinates but just in case check for geometries
					if ($coordinates != null || $boundaries != null || !empty($related_locations) || !empty($related_subsites)) {
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
					
					else {
						return $elements;
					}
					
				}
			}
		}

		return $elements;
		
    }

}
