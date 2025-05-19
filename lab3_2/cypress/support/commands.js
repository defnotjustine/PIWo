// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

Cypress.Commands.add('mockFirebase', () => {
  cy.intercept('GET', '**/books**', {
    statusCode: 200,
    body: [
      {
        id: '1',
        title: 'Testowa książka 1',
        author: 'Autor Testowy',
        category: 'Test'
      },
      {
        id: '2',
        title: 'Inna książka',
        author: 'Inny Autor',
        category: 'Inna'
      }
    ]
  }).as('getBooks');
});

Cypress.Commands.add('login', () => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, 'test@example.com', 'password123');
});