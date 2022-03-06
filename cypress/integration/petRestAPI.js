/// <reference types="cypress" />
import "cypress-each"

describe('Everything about your pets', () => {

    let petId = [];
    let randomId;

    beforeEach(() => {
        randomId = Math.floor(Math.random() * 10000000000000);
    })
    
    context('GET /pets', () => {
        const values = ['available','pending','sold'];
        it.each(values)('should return a pet that has status %s', (status) => {
            cy.request({
                method: 'GET',
                url: `https://petstore.swagger.io/v2/pet/findByStatus?status=${status}`,
            })
                .then(function(response){
                    expect(response.status).to.equal(200);
                    Cypress._.each(response.body, () => {
                        expect(status).to.not.be.empty;
                      })
                });
        });
    });

    context('POST /pets', () => {
        const values = [
            {name : 'puppy', category : 'Dog', status : 'pending'},
            {name : 'Turty', category : 'Truttle', status : 'available'},
            {name : 'Birdy', category : 'Bird', status : 'sold'},
        ]
        it.each(values)('add pet %s', (values) => {
            cy.request({
                method: 'POST',
                url: `https://petstore.swagger.io/v2/pet`,
                headers : {
                    'accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body : {
                    "id": randomId,
                    "category": {
                      "id": 0,
                      "name": values.category
                    },
                    "name": values.name,
                    "photoUrls": [
                      "string"
                    ],
                    "tags": [
                      {
                        "id": 0,
                        "name": "string"
                      }
                    ],
                    "status": values.status
                }
            })
                .then(function(response){
                    petId.push(JSON.stringify(response.body.id));
                    cy.log(petId);
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('status');
                    expect(response.body).to.have.deep.property('status', values.status);
                    expect(response.body).to.have.deep.property('name', values.name);
                    expect(response.body.category).to.have.deep.property('name', values.category);
                });
        });
    });

    context('PUT /pets', () => {
        const values = [
            {id : petId[0], name : 'puppy', category : 'Dog', status : 'available'},
            {id : petId[1], name : 'Turty', category : 'Truttle', status : 'available'},
            {id : petId[2], name : 'Birdy', category : 'Bird', status : 'sold'},
        ]
        it.each(values)('put pet %name', (values) => {
            cy.request({
                method: 'PUT',
                url: `https://petstore.swagger.io/v2/pet`,
                headers : {
                    'accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body : {
                    "id": values.id,
                    "category": {
                      "id": 0,
                      "name": values.category
                    },
                    "name": values.name,
                    "status": values.status
                }
            })
                .then(function(response){
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.deep.property('status', values.status);
                    expect(response.body).to.have.deep.property('name', values.name);
                    expect(response.body.category).to.have.deep.property('name', values.category);
                    cy.log(JSON.stringify(response.body));
                    
                });
        });
    });

    context('DELETE /pets', () => {
        it('try to delete pet', () => {
            cy.request({
                method: 'DELETE',
                url: `https://petstore.swagger.io/v2/pet/${randomId}`,
                failOnStatusCode: false
            })
                .then(function(response){
                    expect(response.status).to.equal(404);
                    cy.log(JSON.stringify(response.body));
                });
        });
    });
});