
# form-validate

  Extends schema validate to give reasonable error messages.

## Usage

  ```js
  var FormValidate = require('form-validate');
  var Model = model(...)
    .use(FormValidate(msgs))
    .attr(...)
    ...;
  var m = new Model().validate();
  m.errors // => [ ... ];
  ```

## API

### FormValidate(msgs : Array)

  `msgs` is the array of the messages to use.  They should have a form
  like the following:

  ```js
  [
    {
      // the field which is responsible for the error as key

      'required': 'My message'
    }
  ]
  ```
