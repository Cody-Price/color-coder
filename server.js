const environment = process.env.NODE_ENV || 'development';
//sets the environment as our node environment or if that is not active then it is set to development
const configuration = require('./knexfile.js')[environment];
//sets the configuration variable that will be applied to our database to be based on our current environment
const database = require('knex')(configuration);
//sets our current database based on our knex file which has been set based on our environment
const express = require('express');
//importing express
const app = express();
//setting up our app as an express app
const bodyParser = require('body-parser');
//json parses our incoming requests automatically

app.use(bodyParser.json());
//applies our body parser
app.use(express.static('public'));
//links the server to utilize our public folder within our application
app.set('port', process.env.PORT || 3000);
//sets the app's port to our environment or if that is not active then it will be port 3000
app.locals.title = 'COLOR CODER';
//sets the local title to 'COLOR CODER'

app.get('/api/v1/palettes', (request, response) => {
  //get palettes endpoint
  database('palettes').select()
  //selects the palettes table in our db
    .then(palettes => {
      //allows us to work with the resolved palettes promise
      response.status(200).json({ palettes })
      //sends a status code of 200 and the entire palettes table to the client
    })
    .catch(error => {
      //allows us to work with the rejected promise
      response.status(500).json({ error })
      //sends a status code of 500 (internal server) and the error to the client
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  //get palettes dynamic id endpoint
  const { id } = request.params;
  //destructures id from the incoming request

  database('palettes').select()
  //selects the palettes table in our db
    .then(palettes => {
      //allows us to work with the resolved palettes promise
      let foundPalette = palettes.find(palette => palette.id === parseInt(id));
      //determines if the specified palette exists in our db
      if(foundPalette) {
        //standard if statement to determine if the palette exists
        response.status(200).json(foundPalette);
        //if it does exist sends a status code of 200 as well as the found palette
      } else {
        response.sendStatus(404);
        //if it does not exist we send the client the status of 404, resource not found
      };
    })
    .catch(error => {
      //allows us to work with the rejected promise
      response.send(500).json({ error });
      //sends a status code of 500 (internal server) and the error to the client
    });
});
  
app.post('/api/v1/palettes', (request, response) => {
  //selects the palettes post endpoint
  const palette = request.body;
  //assigns our request body to the variable palette
  
  for(let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']) {
    //creates a validation loop that we can dynamically check each defined parameter to determine if the data has been provided to us by the client
    if(!palette[requiredParameter]) {
      //same as above with the actual validation step of a conditional
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String>, project_id: <Number> }. You're missing a "${requiredParameter}" property.` })
        //returns an explicite error to the client if missing any one of our defined items in our for/of loop
    };
  };
  
  database('palettes').insert(palette, 'id')
  //selects the palettes table in our database and inserts our palette provided the above validation has passed
  .then(palette => {
    //allows us to work with the resolved promise from our db
    response.status(201).json({ id: palette[0] });
    //sends a status of 201 (successful creation) to the client along with the sql generated id for use by the client
  })
  .catch(error => {
    //allows us to work with a rejected promise
    response.status(500).json({ error })
    //sends a status of 500 (internal server error) as well as the caught error back to the client
  });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  //selects the palettes delete dynamic id endpoint
  database('palettes').where('id', request.params.id).delete()
    //selects the palettes table from our db, matches the given id and if it matches, deletes the record from the table
    .then(palette => {
      //allows us to work with the resolved promise from our db
      response.status(202).json({ id: palette[0] });
      //sends the status of 202 (accepted) as well as the id of the deleted palette to our client
    })
    .catch(error => {
      //allows us to work with the rejected promise from our db
      response.status(500).json({ error });
      //sends a status of 500 (internal server error) as well as the caught error back to the client
    });
});


app.get('/api/v1/projects', (request, response) => {
  //selects the projects get endpoint
  database('projects').select()
  //select the projects table from our db
    .then((projects) => {
      //allows us to work with the resolved promise from our database
      response.status(200).json(projects);
      //sends a status of 200 (success) as well as our projects to our client
    })
    .catch((error) => {
      //allows us to work with the rejected promise
      response.status(500).json({error});
      //sends a status of 500 (internal server error) as well as the caught error back to the client
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  //selects the projects dynamic id get endpoint
  const { id } = request.params;
  //destructures the id from the request parameters
  database('projects').select()
  //selects the projects table from our db
    .then((projects) => {
      //allows us to work with the resolved promise from our db
      let foundProject = projects.find(project => project.id === parseInt(id));
      //if the project exists in our database our find function will determine if it does
      if(foundProject) {
        //if one is found
        response.status(200).json(foundProject);
        //return a status of 200 (success) to our client along with the found project
      } else {
        response.sendStatus(404);
        //if one is not found sends a status of 404 (resource not found)
      };
    })
    .catch(error => {
      //allows us to work with the rejected promise
      response.status(500).json({error})
      //sends a status of 500 (internal server error) as well as the caught error back to the client
    });
});

app.post('/api/v1/projects', (request, response) => {
  //selects the projects post enpoint
  const project = request.body;
  //assigns the incoming body to a variable named project
  if (project.name) {
    //determines if an actual name property was sent and is not empty
    database('projects').select('name')
    //selects the projects table and the name column within
      .then(projectNames => {
        //allows us to work with the resolved promise from our database
        const names = projectNames.map(project => project.name.toLowerCase());
        //iterates over the projects names column and returns an array of just the names in lowercase form to make the endpoint case insensitive
        if (names.includes(project.name.toLowerCase())) {
          //if a matching name is found (case insensitive) within the table...
          response.status(409).json({ error: 'Project name already exists, please pick a different project name.' });
          //sends a status of 409 (conflict) as well as a descriptive error to the client
        } else {
          database('projects').insert(project, 'id')
          //otherwise inserts the new project into the projects table of our db
            .then(project => response.status(201).json({ id: project[0] }));
            //allows us to work with the resolved promise and send a response to the client of a status code of 201 (successful creation) as well as the db generated id for use by said client
        };
      })
      .catch(error => response.status(500).json({error}));
      //allows us to work with the rejected promise from our db with a status of 500 (internal server error) and the error itself fro use by the client
  } else {
    response.status(422).json({ error: `Expected format: { name: <String> }. You're missing a "name" property.`});
    //otherwise sends a status of 422 (unprocessable entitity) and a descriptive error message for use by the client
  };
});

app.delete('/api/v1/projects/:id', (request, response) => {
  //selects our delete projects endpoint with a dynamic id
  database('palettes').where('project_id', request.params.id).delete()
  //selects the palettes database and deletes every palette with the matching project_id
    .then(palette => {
      //allows us to work with the resolved promise from our db
      response.status(202).json({  project_id: palette[0] });
      //sends a status code of 202 (accepted) and the project_id of the deleted palette for use by the client
    })
    .catch(error => {
      //allows us to work with a rejected promise from our db with a status of 500 (internal server error) and the error itself for use by the client
      response.status(500).json({ error });
    });
  database('projects').where('id', request.params.id).delete()
  //selects our projects table from our db and finds the matching id from the request params and deletes the record from the table
    .then(project => {
      //allows us to work with the resolved promise from our db
      response.status(202).json({ id: project[0] });
      //sends a status of 202 (accepted) and the id to the client
    })
    .catch(error => {
      //allows us to work with the rejected promise from our db
      response.status(500).json({ error });
      //sends a status of 500 (internal server error) as well as the error istelf to the client
    });
});

app.all('*', (request, response) => {
  //selects any unhandled enpoint
  response.sendStatus(404);
  //responds with a status of 404 (resource not found)
})

app.listen(app.get('port'), () => {
  //tells the app to listen to our port
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  //logs the in use port to the console
});