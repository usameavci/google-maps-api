import GoogleMapsLatLng from './GoogleMapsLatLng'

export default class GoogleMapsGeolocation {
  static getPosition () {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          resolve(new GoogleMapsLatLng(position.coords.latitude, position.coords.longitude))
        }, () => {
          reject('Geolocation is not supported by this browser')
        })
      } else {
        reject('Geolocation is not supported by this browser')
      }
    })
  }
}