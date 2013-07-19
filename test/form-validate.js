
/**
 * Module dependencies.
 */

var chai = require('chai'),
    should = chai.should(),
    model = require('model'),
    FormValidate = require('form-validate');

/**
 * Tests.
 */

describe('FormValidate', function(){
  it('should remap the errors', function(){
    var errors = {
      required: 'Das Feld darf nicht leer sein.',
      type: 'Das Feld muss vom Typ {{attributeValue}} sein.',
      'enum': function(property, propertyValue, attributeValue) {
        return 'Der Wert muss '
          + ((attributeValue.length > 0) ? 'entweder ':'')
          + attributeValue.join(' oder ')
          + ' sein.';
      }
    };
    var User = model('user')
      .use(FormValidate(errors))
      .attr('name', {
        type: 'string', required: true
      })
      .attr('key', {
        type: 'array',
        required: true,
        items: {
          type: 'object',
          properties: {
            value: { type: 'string', required: true }
          }
        }
      })
      .attr('key2', {
        type: 'string',
        'enum': [ 'test', 'it' ]
      });
    var user = new User({
      name: 'Edward',
      key: [{ value: 234 }],
      key2: 'str'
    });
    user.validate();
    user.errors[0].attr.should.equal('key.0.value');
    user.errors[0].message.should.equal(
      'Das Feld muss vom Typ string sein.'
    );
    user.errors[1].attr.should.equal('key2');
    user.errors[1].message.should.equal(
      'Der Wert muss entweder test oder it sein.'
    );
  });
});
