const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile.js')[environment];
const database = require('knex')(configuration);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'COLOR CODER';

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      response.status(200).json({ palettes })
    })
    .catch(error => {
      response.sendStatus(500).json({ error })
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').select()
    .then(palettes => {
      let foundPalette = palettes.find(palette => palette.id === parseInt(id));
      if(foundPalette) {
        response.status(200).json(foundPalette);
      } else {
        response.sendStatus(404);
      };
    })
    .catch(error => {
      response.send(500).json({ error });
    });
});
  
app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  
  for(let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']) {
    if(!palette[requiredParameter]) {
      return response
      .status(422)
      .send({ error: `Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String>, project_id: <Number> }. You're missing a "${requiredParameter}" property.` })
    };
  };
  
  database('palettes').insert(palette, 'id')
  .then(palette => {
    response.status(201).json({ id: palette[0] });
  })
  .catch(error => {
    response.status(500).json({ error })
  });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).delete()
    .then(palette => {
      response.status(202).json({ id: palette[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({error});
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  database('projects').select()
    .then((projects) => {
      let foundProject = projects.find(project => project.id === parseInt(id));
      if(foundProject) {
        response.status(200).json(foundProject);
      } else {
        response.sendStatus(404);
      };
    })
    .catch(error => {
      response.status(500).json({error})
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  if (project.name) {
    database('projects').select('name')
      .then(projectNames => {
        const names = projectNames.map(project => project.name.toLowerCase());
        if (names.includes(project.name.toLowerCase())) {
          response.status(409).json({ error: 'Project name already exists, please pick a different project name.' });
        } else {
          database('projects').insert(project, 'id')
            .then(project => response.status(201).json({ id: project[0] }));
        };
      })
      .catch(error => response.status(500).json({error}));
  } else {
    response.status(422).json({ error: `Expected format: { name: <String> }. You're missing a "name" property.`});
  };
});

app.delete('/api/v1/projects/:id', (request, response) => {
  database('palettes').where('project_id', request.params.id).delete()
    .then(palette => {
      response.status(202).json({  project_id: palette[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  database('projects').where('id', request.params.id).delete()
    .then(project => {
      response.status(202).json({ id: project[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});