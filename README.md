#Serverless Single Plugin

Removes unnecessary folders, or unused lambda functions in your zip file, thus reducing zip file size.

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

In the `custom` property of your `s-function.json` add a single property. include propery is a list of folder name you want to exclude from removing, or include it your zip file
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
 
