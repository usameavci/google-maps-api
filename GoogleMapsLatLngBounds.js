const GoogleMapsLatLng = require('./GoogleMapsLatLng')

module.exports = class GoogleMapsLatLngBounds {
  constructor (southwest, northeast) {
    if (southwest.b && southwest.f) {
      this.context = southwest
    } else {
      let latlng = southwest

      if (southwest && northeast) {
        latlng = [southwest, northeast]
      }

      this.context = new window.google.maps.LatLngBounds(latlng)
    }

    return this
  }

  update (southwest, northeast) {
    if (southwest.b && southwest.f) {
      this.context = southwest
    } else {
      let latlng = southwest

      if (southwest && northeast) {
        latlng = [southwest, northeast]
      }

      this.context = new window.google.maps.LatLngBounds(latlng)
    }

    return this
  }

  getCenter () {
    return new GoogleMapsLatLng(this.context.getCenter())
  }

  getNorthEast () {
    return new GoogleMapsLatLng(this.context.getNorthEast())
  }

  getSouthWest () {
    return new GoogleMapsLatLng(this.context.getSouthWest())
  }

  isEmpty () {
    return this.context.isEmpty()
  }

  toJSON () {
    return this.context.toJSON()
  }

  getContext () {
    return this.context
  }
}