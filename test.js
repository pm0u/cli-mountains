const imageToAscii = require("image-to-ascii")
const computeSize = require('compute-size')
const exec = require('child_process').exec
const axios = require('axios')
const flickrKey = process.env.flickr_key
const flickrSecret = process.env.flickr_secret

exec('tput cols', (error, stdout, stderr) => {

  const termWidth = Math.min(Math.floor(stdout / 2), 60)

  const opts = {
    //bg:true,
    white_bg:true,
    size_options: {
      screen_size: {
        width: termWidth
      }
    },
    size: {
      width: termWidth
    },
  }

  axios.get("http://api.flickr.com/services/feeds/photos_public.gne?tags=mountains&format=json").then(data => {
    const betterData = data.data.replace(/^.*\(/,"").replace(/\)$/,"")
    const jsonData = JSON.parse(betterData)
    const imageData = jsonData.items
    imageData.forEach(datas => {
      imageToAscii(datas.media.m, opts, (err,converted) => {
        console.log(err || converted)
      })
    })
  }).catch(err => {
    console.log(err)
  })


  imageToAscii("https://cdn.images.express.co.uk/img/dynamic/130/590x/Mountains-625882.jpg", opts, (err, converted) => {
    console.log(err || converted)
    console.log('---')
  })


  imageToAscii("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Monasterio_Khor_Virap%2C_Armenia%2C_2016-10-01%2C_DD_25.jpg/1200px-Monasterio_Khor_Virap%2C_Armenia%2C_2016-10-01%2C_DD_25.jpg", opts, (err, converted) => {
  console.log(err || converted);
  })

  //imageToAscii("https://cdn.images.express.co.uk/img/dynamic/130/590x/Mountains-625882.jpg",opts, (err, converted) => {
  //    console.log(err || converted);
  //})


})
