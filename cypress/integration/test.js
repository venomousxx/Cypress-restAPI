/// <reference types="cypress" />
import "cypress-each"

describe('Everything about your pets', () => {
    context('GET /pets', () => {
        const values = ['available','pending','sold'];
        it.each(values)('should return a pet that has status %s', (status) => {
            cy.request({
                method: 'GET',
                url: `https://petstore.swagger.io/v2/pet/findByStatus?status=${status}`,
            })
                .should((response) => {
                    let body = JSON.stringify(response.body);
                    expect(response.status).to.equal(200);                    
                    expect(body).to.have.property('status');
                    
                });
        });
    });
});