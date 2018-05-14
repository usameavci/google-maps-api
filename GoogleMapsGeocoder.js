const stripHtml = require('string-strip-html')
const GoogleMapsLatLng = require('./GoogleMapsLatLng')
const GoogleMapsLatLngBounds = require('./GoogleMapsLatLngBounds')

module.exports = class GoogleMapsGeocoder {
  constructor () {
    this.geocoder = new window.google.maps.Geocoder()
    this.autocomplete = new window.google.maps.places.AutocompleteService()
    this.zoomDefinitions = {
      country: 12,
      postal_code: 12,
      city: 13,
      district: 15,
      neighborhood: 15,
      street_name: 17,
      street_number: 18
    }
    this.typeDefinitions = [{
      key: 'country',
      type: 'country',
      label: 'maps.types.country'
    }, {
      key: 'postal_code',
      type: 'postal_code',
      label: 'maps.types.postal_code'
    }, {
      key: 'city',
      type: 'administrative_area_level_1',
      label: 'maps.types.city'
    }, {
      key: 'city',
      type: 'locality',
      label: 'maps.types.city'
    }, {
      key: 'district',
      type: 'administrative_area_level_2',
      label: 'maps.types.district'
    }, {
      key: 'neighborhood',
      type: 'neighborhood',
      label: 'maps.types.neighborhood'
    }, {
      key: 'neighborhood',
      type: 'administrative_area_level_4',
      label: 'maps.types.neighborhood'
    }, {
      key: 'street_name',
      type: 'route',
      label: 'maps.types.street_name'
    }, {
      key: 'street_number',
      type: 'street_number',
      label: 'maps.types.street_number'
    }]

    return this
  }

  parseGeocodeFromLocationList (results) {
    const response = {}

    results.map(item => {
      const ac = (item.address_components && item.address_components[0]) || {}
      const obj = {
        place_id: item.place_id,
        name: ac.long_name || item.name,
        formatted_address: item.formatted_address,
        geometry: {
          location: null,
          viewport: null
        },
        types: item.types
      }

      if (item.geometry) {
        obj.geometry = {
          location: new GoogleMapsLatLng(item.geometry.location),
          viewport: new GoogleMapsLatLngBounds(item.geometry.viewport)
        }
      }

      if (item.types.indexOf('country') !== -1) {
        response.country = obj
      } else if (item.types.indexOf('administrative_area_level_1') !== -1) {
        response.city = obj
      } else if (item.types.indexOf('administrative_area_level_2') !== -1) {
        response.district = obj
      } else if (item.types.indexOf('administrative_area_level_4') !== -1) {
        response.neighborhood = obj
      } else if (item.types.indexOf('route') !== -1 || item.types.indexOf('street_address') !== -1) {
        response.address = obj
      } else if (item.types.indexOf('street_number') !== -1) {
        response.street_number = obj
      } else if (item.types.indexOf('postal_code') !== -1) {
        response.postal_code = obj
      }

      return obj
    })

    return response
  }

  parseGeocodeFromLocation (item) {
    const ac = (item.address_components && item.address_components[0]) || {}
    const obj = {
      place_id: item.place_id,
      name: ac.long_name || item.name,
      address_extended: [],
      geometry: {
        location: new GoogleMapsLatLng(item.geometry.location),
        viewport: new GoogleMapsLatLngBounds(item.geometry.viewport)
      },
      types: item.types
    }

    if (item.adr_address) {
      obj.address_formatted = stripHtml(item.adr_address)
    } else {
      obj.address_formatted = item.formatted_address
    }

    if (item.address_components && item.address_components.length > 0) {
      this.typeDefinitions.map(definition => {
        item.address_components.map(component => {
          if (component.types.indexOf(definition.type) !== -1) {
            obj.address_extended.push({
              key: definition.key,
              label: definition.label,
              value: component.long_name
            })
          }

          return component
        })

        return definition
      })

      const lastAddressItem = obj.address_extended[obj.address_extended.length - 1]
      obj.zoom = this.zoomDefinitions[lastAddressItem.key]
    }

    return obj
  }

  parseGeocodeFromPlaceId (results) {
    const item = results && results[0]
    const ac = (item.address_components && item.address_components[0]) || {}

    const obj = {
      place_id: item.place_id,
      name: ac.long_name || item.name,
      geometry: {
        location: new GoogleMapsLatLng(item.geometry.location),
        viewport: new GoogleMapsLatLngBounds(item.geometry.viewport)
      },
      types: item.types
    }

    if (item.adr_address) {
      obj.address_formatted = stripHtml(item.adr_address)
    } else {
      obj.address_formatted = item.formatted_address
    }

    return obj
  }

  findByPlaceId (placeId) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({
        placeId
      }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          resolve(results[0])
        }
      })
    })
  }

  findByLatLng (lat, lng) {
    let location

    if (lat.constructor.name === 'GoogleMapsLatLng') {
      location = lat.getContext()
    } else if (lat.lat && lat.lng) {
      location = lat
    } else {
      location = lat

      if (lat && lng) {
        location = {
          lat,
          lng
        }
      }
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({
        location
      }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const place = this.parseGeocodeFromLocation(results[0])

          resolve(place)
        }
      })
    })
  }
}