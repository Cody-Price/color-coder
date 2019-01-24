const leftColor = document.querySelector('.left-color');
const midLeftColor = document.querySelector('.mid-left-color');
const midColor = document.querySelector('.mid-color');
const midRightColor = document.querySelector('.mid-right-color');
const rightColor = document.querySelector('.right-color');

const leftP = document.querySelector('.left-p');
const midLeftP = document.querySelector('.mid-left-p');
const midP = document.querySelector('.mid-p');
const midRightP = document.querySelector('.mid-right-p');
const rightP = document.querySelector('.right-p');

const leftLock = document.querySelector('.left-lock')
const midLeftLock = document.querySelector('.mid-left-lock')
const midLock = document.querySelector('.mid-lock')
const midRightLock = document.querySelector('.mid-right-lock')
const rightLock = document.querySelector('.right-lock')

const generatePaletteButton = document.querySelector('.generate');
const dropdown = document.querySelector('.dropdown');
const paletteName = document.querySelector('.user-palette-name-input');
const saveButton = document.querySelector('.save-btn');
const projectName = document.querySelector('.new-project-name-input');
const newProjectButton = document.querySelector('.new-project-btn');
const projectContainer = document.querySelector('.project-container');

const generateHex = () => {
  const hexArray = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']
  let returnedHexArray = ['#']
  while(returnedHexArray.length <= 6) {
    let randomNumber = Math.floor(Math.random() * 16)
    returnedHexArray.push(hexArray[randomNumber])
  }
  if(returnedHexArray.length === 7) {
    return returnedHexArray.join('')
  }
}

const generateRandomPalette = () => {
  if(leftLock.classList.contains('fa-unlock')) {
    let color1 = generateHex()
    leftColor.setAttribute('style', `background-color: ${color1}`)
    leftP.innerText = `${color1}`
    leftP.setAttribute('style', `background-color: ${color1}`)
  }
  if(midLeftLock.classList.contains('fa-unlock')) {
    let color2 = generateHex()
    midLeftColor.setAttribute('style', `background-color: ${color2}`)
    midLeftP.innerText = `${color2}`
    midLeftP.setAttribute('style', `background-color: ${color2}`)
  }
  if(midLock.classList.contains('fa-unlock')) {
    let color3 = generateHex()
    midColor.setAttribute('style', `background-color: ${color3}`)
    midP.innerText = `${color3}`
    midP.setAttribute('style', `background-color: ${color3}`)
  }
  if(midRightLock.classList.contains('fa-unlock')) {
    let color4 = generateHex()
    midRightColor.setAttribute('style', `background-color: ${color4}`)
    midRightP.innerText = `${color4}`
    midRightP.setAttribute('style', `background-color: ${color4}`)
  }
  if(rightLock.classList.contains('fa-unlock')) {
    let color5 = generateHex()
    rightColor.setAttribute('style', `background-color: ${color5}`)
    rightP.innerText = `${color5}`
    rightP.setAttribute('style', `background-color: ${color5}`)
  }
}

generateRandomPalette()

const generateProjectPalette = () => {
  let paletteId = Date.now()
  let newProjectPalette = document.createElement('div')
  newProjectPalette.classList.add('project-palette')
  newProjectPalette.innerHTML = `
    <label>${paletteName.value}</label>
    <section class="project-card-palette-container">
      <div class="sub-container">
        <div class="sub" data-id="${paletteId}">
          <div class="left-card-color card-color" style="background-color: ${leftP.innerText}"></div>
          <div class="mid-card-left-color card-color" style="background-color: ${midLeftP.innerText}"></div>
          <div class="mid-card-color card-color" style="background-color: ${midP.innerText}"></div>
          <div class="mid-card-right-color card-color" style="background-color: ${midRightP.innerText}"></div>
          <div class="right-card-color card-color" style="background-color: ${rightP.innerText}"></div>
        </div>
        <i class="fas fa-trash-alt"></i>
      </div>
    </section>
  `
  document.querySelector('.card-palette-container').appendChild(newProjectPalette)
}

const grabPaletteObject = () => {
  if (paletteName.value !== '') {
    generateProjectPalette()
    return {
      name: paletteName.value,
      color1: leftP.innerText,
      color2: midLeftP.innerText,
      color3: midP.innerText,
      color4: midRightP.innerText,
      color5: rightP.innerText
    }
  }
}

const toggleLock = (e) => {
  if (e.target.childNodes[3]) {
    if(e.target.childNodes[3].classList.contains('fa-unlock')) {
      e.target.childNodes[3].classList.remove('fa-unlock')
      e.target.childNodes[3].classList.add('fa-lock')
    } else {
      e.target.childNodes[3].classList.add('fa-unlock')
      e.target.childNodes[3].classList.remove('fa-lock')
    }
  }
  if(e.target.classList.contains('fa-unlock')) {
    e.target.classList.remove('fa-unlock')
    e.target.classList.add('fa-lock')
  } else if (e.target.classList.contains('fa-lock')) {
    e.target.classList.add('fa-unlock')
    e.target.classList.remove('fa-lock')
  }
}

const generateNewProject = () => {
  let newProjectName = projectName.value
  let newCard = document.createElement('div')
  newCard.classList.add('project-card')
  newCard.innerHTML = `<h3>${newProjectName}</h3>`
  projectContainer.appendChild(newCard)
}

newProjectButton.addEventListener('click', generateNewProject)
saveButton.addEventListener('click', grabPaletteObject)
generatePaletteButton.addEventListener('click', generateRandomPalette)
leftColor.addEventListener('click', toggleLock)
midLeftColor.addEventListener('click', toggleLock)
midColor.addEventListener('click', toggleLock)
midRightColor.addEventListener('click', toggleLock)
rightColor.addEventListener('click', toggleLock)