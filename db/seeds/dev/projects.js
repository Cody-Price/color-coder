
// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex('palettes').del()
//     .then(() => knex('projects').del())
//     .then(() => {
//       // Inserts seed entries
//       return Promise.all([
//         knex('projects').insert({
//           name: 'spring'
//         }, 'id')
//           .then(project => {
//             return knex('palettes').insert([
//               {
//                 name: 'green',
//                 color1: '#111111',
//                 color2: '#222222',
//                 color3: '#333333',
//                 color4: '#444444',
//                 color5: '#555555',
//                 project_id: project[0]
//               },
//               {
//                 name: 'blue',
//                 color1: '#666666',
//                 color2: '#777777',
//                 color3: '#888888',
//                 color4: '#999999',
//                 color5: '#AAAAAA',
//                 project_id: project[0]
//               }
//             ])
//           })
//           .then(() => console.log('Seeding complete'))
//           .catch(error => console.log(`Error seeding data: ${error}`))
//       ])
//     })
//     .catch(error => console.log(`Error seeding data: ${error}`));
// };

let projectsData = [
  {
    name: 'spring',
    palettes: [
      {
        name: 'green',
        color1: '#111111',
        color2: '#222222',
        color3: '#333333',
        color4: '#444444',
        color5: '#555555'
      },
      {
        name: 'blue',
        color1: '#666666',
        color2: '#777777',
        color3: '#888888',
        color4: '#999999',
        color5: '#AAAAAA'
      }
    ]
  },
  {
    name: 'fall',
    palettes: [
      {
        name: 'orange',
        color1: '#BBBBBB',
        color2: '#CCCCCC',
        color3: '#DDDDDD',
        color4: '#EEEEEE',
        color5: '#FFFFFF'
      },
      {
        name: 'winter',
        color1: '#1A1A1A',
        color2: '#2B2B2B',
        color3: '#3C3C3C',
        color4: '#4D4D4D',
        color5: '#5E5E5E'
      }
    ]
  }
]

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
  }, 'id')
    .then(projectId => {
      let palettePromises = [];

      project.palettes.forEach(palette => {
        palettePromises.push(
          createPalette(knex, {
            name: palette.name,
            color1: palette.color1,
            color2: palette.color2,
            color3: palette.color3,
            color4: palette.color4,
            color5: palette.color5,
            project_id: projectId[0]
          }, 'id')
        )
      });

      return Promise.all(palettePromises);
    })
}

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
}

exports.seed = (knex, Promise) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];

      projectsData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
