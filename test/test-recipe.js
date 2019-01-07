const chai = require('chai');
const chaiHTTP = require('chai-http')
const expect = chai.expect;
const should = chai.should();

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHTTP);

describe('recipes', function() {
    before(function() {
        return runServer;
    })
    after(function() {
        return closeServer;
    })

    it('should retrieve a list of recipes(GET)', function() {
        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                (res.body).forEach(function(item) {
                    expect(item).to.be.an('object')
                })
                
            })
    });

    it('should add a recipe to the existing list(POST)', function() {
        const options = {
                'name': 'namey',
                'ingredients': 'neuance'
        }
        return chai.request(app)
            .post('/recipes')
            .send(options)
            .then(function(res) {
                expect(res).to.have.status(201);
                (Object.keys(res.body)).should.include('name', 'ingredients');
                expect(res).to.be.an('object');
                expect(res.body.name).to.be.eql(options.name)  
            })
    })

    it('should update an existing recipe(PUT)', function() {
        const newRecipe = {
            name: 'name',
            ingredients: 'ingreds'};
   
        return chai.request(app)
        .get('/recipes')
        .then(function(res){
          const id = res.body[2].id;
            newRecipe.id = id;
              return chai.request(app)
                .put(`/recipes/${newRecipe.id}`)
                .send(newRecipe);
        })
        .then(function(res){
        expect(res).to.have.status(204);
        })
    });  
    
    it('should remove a recipe item(DELETE)', function() {
        return chai.request(app)
        .get('/recipes')
        .then(function(res) {
            const removal = res.body[0];
             return chai.request(app)
            .delete(`/recipes/${removal.id}`)
        })
        .then(function(res){
           expect(res).to.have.status(204)
        })
    })

});