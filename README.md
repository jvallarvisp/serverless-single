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
 

Go into each project component and install its dependencies via npm:
```
npm install
```

Deploy your functions and endpoints:
```
serverless dash deploy
```


To generate sequelize object/model 
```
npm install -g sequelize-auto
```
and then run, for more info visit: [Sequelize Auto](https://github.com/sequelize/sequelize-auto)
```
sequelize-auto -o “./lib/_model" -d DATABASE_NAME -h HOST_NAME -u USERNAME -p PORT -x PASSWORD -e mysql
```
