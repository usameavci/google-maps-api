import GoogleMapsGeocoder from './GoogleMapsGeocoder'

export default class GoogleMapsAutocomplete {
  constructor (input) {
    this.autocomplete = new window.google.maps.places.Autocomplete(input)
    this.geocoder = new GoogleMapsGeocoder()

    return this
  }

  setMap (map) {
    if (!map || !this.autocomplete) {
      return this
    }

    this.autocomplete.bindTo('bounds', map.getContext())

    return this
  }

  onPlaceChanged (cb) {
    this.autocomplete.addListener('place_changed', () => {
      let place = this.autocomplete.getPlace()

      if (place && !place.geometry) {
        return cb({
          message: `No details available for input: '${place.name}'`
        })
      }

      place = this.geocoder.parseGeocodeFromLocation(place)

      return cb(null, place)
    })
  }
}