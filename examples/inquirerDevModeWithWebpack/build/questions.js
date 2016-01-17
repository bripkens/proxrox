'use strict';

module.exports = [
  {
    type: 'list',
    name: 'environment',
    message: 'Which environment would you like to run against?',
    choices: [
      {
        name: 'Local Development Environment',
        value: 'http://localhost:4001'
      },
      {
        name: 'Production Environment',
        value: 'https://enigmatic-headland-7475.herokuapp.com'
      }
    ]
  },
  {
    type: 'list',
    name: 'compilationMode',
    message: 'In which mode would you like the JavaScript to be compiled?',
    choices: [
      {
        name: 'Development',
        value: 'dev'
      },
      {
        name: 'Production',
        value: 'prod'
      }
    ]
  }
];
