const { merge, unset } = require('lodash')
const { load, loaded } = require('./GoogleMapsLoader')
const GoogleMapsLatLng = require('./GoogleMapsLatLng')

module.exports = class GoogleMaps {
  constructor (el, options) {
    if (typeof el === 'string') {
      el = document.getElementById(el)
    }

    if (options && options.height) {
      el.style.height = `${options.height}px`
      unset(options.height)
    }

    const defaults = {
      zoom: 8,
      mapTypeControl: true,
      center: { lat: 38.9030898, lng: 35.3404132 }
    }

    const baseOptions = GoogleMaps.getOptions()

    this.el = el
    this.options = merge(defaults, baseOptions, options)

    const config = GoogleMaps.getConfig()
    load(config)

    return this
  }

  ready () {
    return new Promise(resolve => {
      loaded.then(() => {
        this.context = new window.google.maps.Map(this.el, this.options)
        resolve(this)
      })
    })
  }

  static setConfig (config) {
    GoogleMaps.prototype._config = config
  }

  static getConfig () {
    return GoogleMaps.prototype._config
  }

  static setOptions (options) {
    GoogleMaps.prototype._options = options
  }

  static getOptions () {
    return GoogleMaps.prototype._options
  }

  fitBounds (boundSW, boundNE, zoom) {
    if (!zoom) {
      zoom = this.options.zoom
    }

    const bounds = new window.google.maps.LatLngBounds(boundSW.get(), boundNE.get())

    this.context.fitBounds(bounds)
    this.context.setZoom(zoom)

    return this
  }

  onClick (cb) {
    this.context.addListener('click', (e) => {
      cb(new GoogleMapsLatLng(e.latLng))
    })

    return this
  }

  setCenter (lat, lng) {
    let center = lat

    if (lat && lng) {
      center = new GoogleMapsLatLng(lat, lng)
    }

    this.options.center = center
    this.context.setCenter(center.getContext())

    return this
  }

  get center () {
    const center = this.context.getCenter()

    if (!center) return

    return new GoogleMapsLatLng(center.lat(), center.lng())
  }

  setZoom (zoom) {
    this.options.zoom = zoom
    this.context.setZoom(zoom)

    return this
  }

  get zoom () {
    return this.context.getZoom()
  }

  getContext () {
    return this.context
  }
}