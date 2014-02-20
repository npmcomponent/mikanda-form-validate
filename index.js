
/**
 * Module dependencies.
 */

var bind = require('component-bind'),
    minstache = require('visionmedia-minstache'),
    toFunction = require('component-to-function'),
    SchemaValidate = require('mikanda-schema-validate'),

    // symbol imports

    compile = minstache.compile;

/**
 * Module exports.
 */

module.exports = FormValidate;

/**
 * Initialize new form-validate.
 *
 * @param {Array} msgs the error messages
 */

function FormValidate(msgs) {
  if (!(this instanceof FormValidate)) return new FormValidate(msgs);
  var self = this;
  this.msgs = msgs || {};
  return function(Model){

    // register schema validator

    Model.use(new SchemaValidate());

    // register own validation function

    Model.validate(bind(self, self.validate, Model));
  };
}

/**
 * Performs the rewriting of the errors.
 *
 * @param {Function} Model the model class
 * @param {Model} model the model instance which was validated
 */

FormValidate.prototype.validate = function(Model, model){
  var msgs = this.msgs,
      cache = {};

  // map the errors to messages specified by the user

  model.errors.forEach(function(error){
    var attrFunc,
        err = error.message,
        attribute = err.attribute,
        message;

    // first check the cache if we already compiled a message for the
    // attribute

    if ((message = cache[attribute]) == null) {

      // compile message if cache miss

      message
        = cache[attribute]
        = new Message(msgs[attribute] || err.message);
    }

    // render the message

    error.message = message.render(Model, model, error);
    error.attr += err.uri
      .split('#')[1]
      .replace(/\//g, '.');
  });
};

/**
 * Initialize new message.
 */

function Message(msg) {
  if (typeof msg === 'string') this.msg = msg;
  else this.fn = msg;
}

/**
 * Render the wrapped message;
 */

Message.prototype.render = function(Model, model, error){
  var fn,
      ctx;
  ctx = this.buildContext(Model, model, error);

  // generate function to access the attributes value

  if (typeof this.compiled === 'function') {

    // use compiled minstache template if we have one

    return this.renderCompiled(ctx);
  } else if (typeof this.msg === 'string') {

    // we have a minstache template

    return this.renderMinstache(ctx);
  } else {
    return this.renderFunction(ctx);
  }
};

/**
 * Render an already compiled minstache template.
 *
 * @api private
 */

Message.prototype.renderCompiled = function(ctx){
  return this.compiled(ctx);
};

/**
 * Render a bare minstache template.
 *
 * @api private
 */

Message.prototype.renderMinstache = function(ctx){
  var compiled;
  compiled = this.compiled = compile(this.msg, ctx);
  return compiled(ctx);
};

/**
 * Render a function.
 *
 * @api private
 */

Message.prototype.renderFunction = function(ctx){
  return this.fn(ctx.property, ctx.propertyValue, ctx.attributeValue);
};

/**
 * Build the context used for rendering.
 *
 * @api private
 */

Message.prototype.buildContext = function(Model, model, error){
  var attrFunc,
      valueFunc,
      err = error.message,
      ctx,
      expr,
      valueExpr;
  expr = error.attr
    + err.schemaUri.split('#')[1].replace(/\//g, '.')
    + '.'
    + err.attribute;
  valueExpr = error.attr
    + err.uri.split('#')[1].replace(/\//g, '.');

  // escape array indices

  expr = expr.replace(/\.([0-9])(\.?)/g, '[$1]$2');
  valueExpr = valueExpr.replace(/\.([0-9])(\.?)/g, '[$1]$2');
  attrFunc = toFunction(expr);
  valueFunc = toFunction(valueExpr);
  ctx = {
    attributeValue: attrFunc(Model.attrs),
    property: error.attr,
    propertyValue: valueFunc(model.attrs)
  };
  return ctx;
};
