// import GoogleMapsGeocoder from './GoogleMapsGeocoder'
import GoogleMapsLatLng from './GoogleMapsLatLng'

export default class GoogleMapsMarker {
  constructor () {
    this.context = new window.google.maps.Marker()
    // this.geocoder = new GoogleMapsGeocoder()

    return this
  }

  setMap (map) {
    this.map = map
    this.context.setMap(map.getContext())

    return this
  }

  setPosition (position) {
    this.position = position
    this.context.setPosition(position.getContext())

    return this
  }

  isDraggable (val) {
    this.context.setDraggable(val)

    return this
  }

  isClickable (val) {
    this.context.setClickable(val)

    return this
  }

  getPosition () {
    return this.context.getPosition()
  }

  onDrag (cb) {
    this.context.addListener('drag', (e) => {
      cb(new GoogleMapsLatLng(e.latLng))
    })

    return this
  }

  onDragStart (cb) {
    this.context.addListener('dragstart', (e) => {
      cb(new GoogleMapsLatLng(e.latLng))
    })

    return this
  }

  onDragEnd (cb) {
    this.context.addListener('dragend', (e) => {
      cb(new GoogleMapsLatLng(e.latLng))
    })

    return this
  }

  remove () {
    this.context.setMap(null)
  }

  static createIcon (url, width = 32, height = 32) {
    return {
      url,
      scaledSize: new window.google.maps.Size(width, height),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(0, 0)
    }
  }

  getContext () {
    return this.context
  }
}