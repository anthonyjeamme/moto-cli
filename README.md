# What it is ?

My toolkit i use to save time on my gatsby projects. "moto" means "fire" in lingala :P.

# Commands

## Add alias in code

```
moto alias add ~myAlias src/path/to/folder
```

Add alias in .eslintrc, jsconfig.json and gatsby-config.js.

In order to make it works, you need to add `gatsby-plugin-alias-imports`

```
npm i --save-dev gatsby-plugin-alias-imports
```

and add this comment in the proper location :

` // DO NOT REMOVE THIS COMMENT.`

For example :

```
{
    resolve: `gatsby-plugin-alias-imports`,
    options: {
        alias: {
            '~style': `${__dirname}/src/style` // DO NOT REMOVE THIS COMMENT.
        },
        extensions: ['js', 'scss']
    }
},
```
