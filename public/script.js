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

const errorPage = document.querySelector('.error-page');
const errorMessage = document.querySelector('.error-message');
const errorBtn = document.querySelector('.clear-error-btn');
const generatePaletteButton = document.querySelector('.generate');
const dropdown = document.querySelector('.dropdown');
const paletteName = document.querySelector('.user-palette-name-input');
const saveButton = document.querySelector('.save-btn');
const projectName = document.querySelector('.new-project-name-input');
const newProjectButton = document.querySelector('.new-project-btn');
const projectContainer = document.querySelector('.project-container');
const paletteContainer = document.querySelector('.palette-container');


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

const displayError = (message) => {
  errorPage.setAttribute('style', 'display: block')
  errorMessage.innerText = message
}

const fetchProjects = async () => {
  const url = '/api/v1/projects';
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch(error) {
    console.log(error);
  }
}

const populateSelectElement = async () => {
  dropdown.innerHTML = '<option value="" disabled selected>SELECT A PROJECT</option>'
  const projectsArray = await fetchProjects();
  projectsArray.forEach(project => {
    const newOption = document.createElement('option');
    newOption.setAttribute('value', project.id)
    newOption.innerText = project.name
    dropdown.appendChild(newOption)
  })
}

populateSelectElement()

const populateExistingProjects = async () => {
  projectContainer.innerHTML = ''
  const projectsArray = await fetchProjects();
  projectsArray.forEach(project => {
    const newProjectCard = document.createElement('div')
    newProjectCard.setAttribute('class', 'project-card')
    newProjectCard.setAttribute('data-id', project.id)
    newProjectCard.innerHTML = `
        <div class="row">
          <h3>${project.name}</h3><i class="fas fa-trash-alt" id="project-trash"></i>
        </div>
        <section class="card-palette-container">

        </section>
      `
    projectContainer.appendChild(newProjectCard)
  })
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

const flashPalette = () => {
  paletteContainer.classList.add('white')
  setTimeout(() => {
    paletteContainer.classList.remove('white')
  }, 600);
}

const postProjectPalette = async () => {
  if (paletteName.value !== '' && dropdown.value !== '') {
    flashPalette()
    const url = '/api/v1/palettes'
    const data = grabPaletteObject()
    const postObject = {
      headers: {
        "content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(data),
      method: "POST"
    }
    const response = await fetch(url, postObject)
    const result = await response.json()
  
  
    let newProjectPalette = document.createElement('div')
    newProjectPalette.classList.add('project-palette')
    newProjectPalette.innerHTML = `
      <label>${paletteName.value}</label>
      <section class="project-card-palette-container">
        <div class="sub-container">
          <div class="sub" data-id="${result.id}">
            <div class="left-card-color card-color" style="background-color: ${leftP.innerText}">${leftP.innerText}</div>
            <div class="mid-card-left-color card-color" style="background-color: ${midLeftP.innerText}">${midLeftP.innerText}</div>
            <div class="mid-card-color card-color" style="background-color: ${midP.innerText}">${midP.innerText}</div>
            <div class="mid-card-right-color card-color" style="background-color: ${midRightP.innerText}">${midRightP.innerText}</div>
            <div class="right-card-color card-color" style="background-color: ${rightP.innerText}">${rightP.innerText}</div>
          </div>
          <i class="fas fa-trash-alt"></i>
        </div>
      </section>
    `
    const projectNodes = Array.from(document.querySelectorAll('.project-card'))
    const matchingProject = projectNodes.find(projectNode => {
      if (projectNode.getAttribute('data-id') === data.project_id) {
        return projectNode
      }
    })
    matchingProject.childNodes[3].appendChild(newProjectPalette)
  } else if (dropdown.value === '' && paletteName.value === '') {
    displayError('Please select a project and enter a name for your palette.')
  } else if (dropdown.value === '') {
    displayError('Please select a project for your palette to attach to.')
  } else {
    displayError('Please enter a name for your palette.')
  }
}

const fetchPalettes = async () => {
  const url = '/api/v1/palettes'
  try {
    const response = await fetch(url)
    const result = await response.json()
    return result.palettes
  } catch(error) {
    console.log(error)
  }
}

const populatePalettes = async () => {
  await populateExistingProjects()
  const projectNodes = Array.from(document.querySelectorAll('.project-card'))
  const paletteArray = await fetchPalettes()
  paletteArray.forEach(palette => {

    let newProjectPalette = document.createElement('div')
    newProjectPalette.classList.add('project-palette')
    newProjectPalette.innerHTML = `
      <label>${palette.name}</label>
      <section class="project-card-palette-container">
        <div class="sub-container">
          <div class="sub" data-id="${palette.id}">
            <div class="left-card-color card-color" style="background-color: ${palette.color1}">${palette.color1}</div>
            <div class="mid-card-left-color card-color" style="background-color: ${palette.color2}">${palette.color2}</div>
            <div class="mid-card-color card-color" style="background-color: ${palette.color3}">${palette.color3}</div>
            <div class="mid-card-right-color card-color" style="background-color: ${palette.color4}">${palette.color4}</div>
            <div class="right-card-color card-color" style="background-color: ${palette.color5}">${palette.color5}</div>
          </div>
          <i class="fas fa-trash-alt"></i>
        </div>
      </section>
    `

    const matchingProject = projectNodes.find(projectNode => {
      if (projectNode.getAttribute('data-id') == palette.project_id) {
        return projectNode
      }
    })
    matchingProject.childNodes[3].appendChild(newProjectPalette)
  })
}

populatePalettes()

const grabPaletteObject = () => {
  if (paletteName.value !== '') {
    return {
      name: paletteName.value,
      color1: leftP.innerText,
      color2: midLeftP.innerText,
      color3: midP.innerText,
      color4: midRightP.innerText,
      color5: rightP.innerText,
      project_id: dropdown.value
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

const generateNewProject = async () => {
  let newProjectName = projectName.value
  await saveProject(newProjectName)
  await populateExistingProjects()
  await populateSelectElement()
  await populatePalettes()
}

const saveProject = async (name) => {
  const url = '/api/v1/projects'
  try {
    const postObject = {
      headers: {
        "content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({name}),
      method: "POST"
    }
    const response = await fetch(url, postObject)
    const result = await response.json()
    if(result.error) {
      displayError(result.error)
    }
  } catch(error) {
    console.log('catch error:', error)
  }
}

const deletePalette = async (id) => {
  const url = `/api/v1/palettes/${id}`
  try {
    const deleteObject = {
      headers: {
        "content-type": "application/json; charset=UTF-8"
      },
      method: "DELETE"
    }
    const response = await fetch(url, deleteObject)
    await response.json()
  } catch(error) {
    console.log(error)
  }  
}

const deleteProject = async (id) => {
  const url = `/api/v1/projects/${id}`
  try {
    const deleteObject = {
      headers: {
        "content-type": "application/json; charset=UTF-8"
      },
      method: "DELETE"
    }
    const response = await fetch(url, deleteObject)
    await response.json()
  } catch(error) {
    console.log(error)
  }  
}

const clearErrorPage = () => {
  errorPage.setAttribute('style', 'display: none')
  errorMessage.innerText = ''
}

errorBtn.addEventListener('click', clearErrorPage)
newProjectButton.addEventListener('click', generateNewProject)
saveButton.addEventListener('click', postProjectPalette)
generatePaletteButton.addEventListener('click', generateRandomPalette)
leftColor.addEventListener('click', toggleLock)
midLeftColor.addEventListener('click', toggleLock)
midColor.addEventListener('click', toggleLock)
midRightColor.addEventListener('click', toggleLock)
rightColor.addEventListener('click', toggleLock)
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('fa-trash-alt') && e.target.getAttribute('id') !== 'project-trash') {
    const id = parseInt(e.target.previousSibling.previousSibling.getAttribute('data-id'))
    deletePalette(id)
    e.target.parentElement.parentElement.parentElement.remove()
  }
})
window.addEventListener('click', async (e) => {
  if (e.target.parentElement.classList.contains('row') && e.target.getAttribute('id') === 'project-trash') {

    const id = parseInt(e.target.parentElement.parentElement.getAttribute('data-id'))
    await deleteProject(id)
    e.target.parentElement.parentElement.remove()
    await populateSelectElement()
  }
})