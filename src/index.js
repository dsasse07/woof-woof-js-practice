const dogBar = document.querySelector('#dog-bar')
const filterButton = document.body.querySelector("#good-dog-filter")
const dogInfo = document.body.querySelector("#dog-info")
const baseUrl = "http://localhost:3000/pups"
let filter = false

const renderDogBar = _ => {
  let fullUrl = filter ? baseUrl+"?isGoodDog=true" : baseUrl
  fetch(fullUrl)
  .then(response => response.json())
  .then(dogs => {
    Array.from(dogBar.children).forEach( child => child.remove() )
    dogs.forEach( dog => {
      let span = document.createElement("span")
      span.textContent = dog.name
      dogBar.append(span)
    })
  })
  .catch( error => console.log(error))
}

renderDogBar()

const displayDog = dogName => {
  fetch(baseUrl + `?name=${dogName}`)
  .then(response => response.json() )
  .then( dogData => {
    Array.from(dogInfo.children).forEach (child => child.remove() )

    let dogImg = document.createElement("img")
    let dogName = document.createElement("h2")
    let statusButton = document.createElement("button")
    statusButton.id = "status-button"
    dogInfo.append(dogImg, dogName, statusButton)
    
    dogInfo.dataset.id = dogData[0].id
    dogImg.src = dogData[0].image 
    dogImg.alt = dogData[0].name
    
    dogName.textContent = dogData[0].name
    dogData[0].isGoodDog === true ? statusButton.textContent = "Good Dog!" : statusButton.textContent = "Bad Dog!"
    
  })
}

const toggleGoodDog = (id, currentStatus) => {
  
    config = {
    "method":"PATCH",
    "headers": {
      "Content-type":"application/json",
      "Accept": "application/json"
    },
    "body": JSON.stringify( { isGoodDog: currentStatus === 'Good Dog!' ? false : true } )
    
  }
  fetch(baseUrl+`/${id}`, config)
  .then(response => {
      if (!response.ok) throw new Error (response.statusText)
      return response.json()
  })
  .then( data => {
    document.querySelector("#status-button").textContent = data.isGoodDog ? 'Good Dog!' : 'Bad Dog!'
    renderDogBar()
  })
  .catch( error => console.log(error) )

}

const filterDogs = string => {  
  if ( /OFF/.exec(string) ) {
    filter = true
    filterButton.textContent = filterButton.textContent.replace(/OFF/, "ON")
  } else {
    filter = false
    filterButton.textContent = filterButton.textContent.replace(/ON/, "OFF")
  }
  renderDogBar()
}







const handleClicks = e => {
  switch(true){
    case (e.target.tagName === "SPAN"):
      displayDog(e.target.textContent)
      break
    case (e.target.id === "status-button"):
      toggleGoodDog(e.target.closest('#dog-info').dataset.id, e.target.textContent)
      break
    case (e.target.id === 'good-dog-filter'):
      filterDogs (e.target.textContent)
    }

  }
  
  dogBar.addEventListener('click', handleClicks)
  dogInfo.addEventListener('click', handleClicks)
  filterButton.addEventListener('click', handleClicks)