const imageToAscii = require("image-to-ascii")
const computeSize = require('compute-size')
const exec = require('child_process').exec
const axios = require('axios')
const jimp = require('jimp')
require('dotenv').config()
const flickrKey = process.env.flickr_key
const flickrSecret = process.env.flickr_secret

exec('tput cols', (error, stdout, stderr) => {

  const termWidth = Math.min(Math.floor(stdout / 2), 200)

  const opts = {
    //bg:true,
    white_bg: true,
    size_options: {
      screen_size: {
        width: termWidth
      }
    },
    size: {
      width: termWidth
    },
  }

  axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrKey}&text=mountain&format=json&sort=interestingness-desc&per_page=500`).then(data => {
    const betterData = data.data.replace(/^.*Api\(/, "").replace(/\)$/, "")
    const jsonData = JSON.parse(betterData)
    const photos = jsonData.photos.photo
    const urls = []
    photos.forEach(photo => {
      const farmId = photo.farm
      const serverId = photo.server
      const id = photo.id
      const secret = photo.secret
      const url = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`
      urls.push(url)
    })
    const randomUrl = urls[Math.floor(Math.random() * 500)]
    jimp.read(randomUrl).then(image => {
      image.brightness(.1)
      image.contrast(.2)
      image.getBuffer('image/jpeg', (err, buffer) => {
        imageToAscii(buffer, opts, (err, converted) => {
          console.log(err || converted)
        })
      })

    })
  }).catch(err => {
    console.log(err)
  })
