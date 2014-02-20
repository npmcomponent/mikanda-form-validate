*This repository is a mirror of the [component](http://component.io) module [mikanda/form-validate](http://github.com/mikanda/form-validate). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/mikanda-form-validate`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*

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
