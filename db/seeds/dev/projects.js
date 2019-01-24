
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
        color5: '#AAAAAA',
        project_id: project[0]
      }
    ]
  }
]

exports.seed
