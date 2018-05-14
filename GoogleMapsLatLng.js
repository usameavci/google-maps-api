module.exports = class GoogleMapsLatLng {
  constructor (lat, lng) {
    if (lat.lat && lat.lng) {
      this.context = lat
    } else {
      let latlng = lat

      if (lat && lng) {
        latlng = {
          lat,
          lng
        }
      }

      this.context = new window.google.maps.LatLng(latlng)
    }

    return this
  }

  update (lat, lng) {
    if (lat.lat && lat.lng) {
      this.context = lat
    } else {
      let latlng = lat

      if (lat && lng) {
        latlng = {
          lat,
          lng
        }
      }

      this.context = new window.google.maps.LatLng(latlng)
    }

    return this
  }

  lat () {
    return this.context.lat()
  }

  lng () {
    return this.context.lng()
  }

  getContext () {
    return this.context
  }
}