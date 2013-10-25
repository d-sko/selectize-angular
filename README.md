# selectize-angular

Selectize-angular is an [AngularJS] (http://angularjs.org/) directive for [selectize.js] (http://brianreavis.github.io/selectize.js/) with support for two-way data binding.

## Usage

- add the selectize-angular module to your app
- add attribute `selectize` to the desired input element
  - you can specify [options] (https://github.com/brianreavis/selectize.js/blob/master/docs/usage.md) by setting them as the value of the selectize-attribute
- use the attribute `seloptions` to specify the available options
  - use selectize´s  [labelField and valueField](https://github.com/brianreavis/selectize.js/blob/master/docs/usage.md#data_searching) options to specify which model properties to use as label and value

### Example

```
<input type="text" ng-model="myModel" selectize="{valueField: 'id', labelField: 'name', sortField: 'name', searchField: 'name', plugins: ['remove_button']}" seloptions="availablOptionsModel">
```