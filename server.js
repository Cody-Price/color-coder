const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(express.static('public'))
app.set('port', process.env.PORT || 3000);
app.locals.title = 'COLOR CODER';

app.locals.projects = [
  {
    id: 1,
    name: 'project1'
  },
  {
    id: 2,
    name: 'project2'
  },
  {
    id: 3,
    name: 'project3'
  }
]

app.locals.palettes = [
  {
    id: 1,
    name: 'warm',
    color1: '#ffffff',
    color2: '#ffcffc',
    color3: '#cffcff',
    color4: '#fcffcf',
    color5: '#cccccc',
    project_id: 1
  },
  {
    id: 2,
    name: 'cool',
    color1: '#000000',
    color2: '#ffcffc',
    color3: '#cffcff',
    color4: '#fcffcf',
    color5: '#cccccc',
    project_id: 3
  },
  {
    id: 3,
    name: 'luke warm',
    color1: '#ffffff',
    color2: '#0123456',
    color3: '#cffcff',
    color4: '#fcffcf',
    color5: '#cccccc',
    project_id: 2
  },
  {
    id: 4,
    name: 'ice cold',
    color1: '#ffffff',
    color2: '#ffcffc',
    color3: '#777777',
    color4: '#fcffcf',
    color5: '#cccccc',
    project_id: 2
  }
]


app.get('/palettes', (request, response) => {
  //should return an array of all palettes
  response.status(200).json(app.locals.palettes)
})

app.get('/palettes/:id', (request, response) => {
  //should return a specific palette
  const { id } = request.params
  let foundPalette = app.locals.palettes.find(palette => parseInt(id) === palette.id)
  if (foundPalette) {
    response.status(200).json(foundPalette)
  } else {
    response.sendStatus(404)
  }
})

app.post('/palettes', (request, response) => {
  //should generate a unique id
  const id = app.locals.palettes.length + 1
  //should add the unique id to the incoming request object
  const palette = request.body
  const postedObject = {id, ...palette}
  //should push the new palette object into the app.locals.palettes array (with the associated project_id)
  app.locals.palettes.push(postedObject)
  response.sendStatus(201)
  //add sad path (422)
})

app.get('/projects', (request, response) => {
  //should return an array of all of the app.locals.projects
  response.status(200).json(app.locals.projects)
})

app.get('/projects/:id', (request, response) => {
  //should return a specific project object
  const { id } = request.params
  let foundProject = app.locals.projects.find(project => parseInt(id) === project.id)
  if (foundProject) {
    response.status(200).json(foundProject)
  } else {
    response.sendStatus(404)
  }
})

app.post('/projects', (request, response) => {
  //should generate a unique id
  const id = app.locals.projects.length + 1
  //should add the unique id to the incoming request object
  const project = request.body
  const postedObject = {id, ...project}
  //should push the new project object into the app.locals.projects array
  app.locals.projects.push(postedObject)
  response.status(201).json(app.locals.projects)
  //sad path (422)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});