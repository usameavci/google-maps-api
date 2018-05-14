const GoogleMapsLatLng = require('./GoogleMapsLatLng')

module.exports = class GoogleMapsLatLngBounds {
  constructor (southeast, northwest) {
    if (southeast.b && southeast.f) {
      this.context = southeast
    } else {
      let latlng = southeast

      if (southeast && northwest) {
        latlng = [southeast, northwest]
      }

      this.context = new window.google.maps.LatLngBounds(latlng)
    }

    return this
  }

  update (southeast, northwest) {
    if (southeast.b && southeast.f) {
      this.context = southeast
    } else {
      let latlng = southeast

      if (southeast && northwest) {
        latlng = [southeast, northwest]
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