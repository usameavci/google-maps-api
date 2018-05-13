var setUp = false

export const loaded = new Promise((resolve, reject) => {
  if (typeof window === 'undefined') {
    return
  }
  window['vueGoogleMapsInit'] = resolve
})

export const load = (options, loadCn) => {
  if (typeof document === 'undefined') {
    return
  }
  if (!setUp) {
    const googleMapScript = document.createElement('SCRIPT')

    if (typeof options !== 'object') {
      throw new Error('options should  be an object')
    }

    if (Array.prototype.isPrototypeOf(options.libraries)) {
      options.libraries = options.libraries.join(',')
    }
    options['callback'] = 'vueGoogleMapsInit'

    let baseUrl = 'https://maps.googleapis.com/'

    if (typeof loadCn === 'boolean' && loadCn === true) {
      baseUrl = 'http://maps.google.cn/'
    }

    let url = baseUrl + 'maps/api/js?' +
      Object.keys(options)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(options[key]))
        .join('&')

    googleMapScript.setAttribute('src', url)
    googleMapScript.setAttribute('async', '')
    googleMapScript.setAttribute('defer', '')
    document.head.appendChild(googleMapScript)
    setUp = true
  }
}