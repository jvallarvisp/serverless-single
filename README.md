#Serverless Single Plugin


##Install

```
npm install serverless-single --save
```

Add the plugin to the plugins array in your Serverless Project's `s-project.json`, like this:

```
"plugins": [
    "serverless-single"
  ]
```

In the `custom` property of your `s-function.json` add a single property.
```
"custom": {
    "single": {
      "include": [
        "node_modules",
        "lib",
        "_auth"
      ]
    }
  },
```
 
