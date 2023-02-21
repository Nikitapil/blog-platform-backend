# Blog platform (Backend)

Simple blog platform for writing and reading blog posts based on markdown.

## Technologies used: 
NodeJs, NestJS, Postgres, Sequelize, Swagger, JWT, class-validator, eslint, prettier, typescript

## Starting guide:
1. Clone this repo and install dependencies (```npm install```)
2. Create .development.env file and add env variables:  
```PORT - server port(example: 5000)```  
```ACCESS_SECRET - secret key for access token(any string)```  
```REFRESH_SECRET - secret key for refresh token(any string)```  
```POSTGRES_HOST - database host(set postgres)```  
```POSTGRES_USER - your postgress username(set postgres)```  
```POSTGRES_DB - database name(recommended: blogplatform)```  
```POSTGRES_PASSWORD - your postgres password(recommended by default: root)```  
```POSTGRES_PORT - database port(recommended by default: 5432)```  
```CLIENT_URL - your client url(need to pass cors)```  
4. Start docker and run in project folder docker compose build
5. To run frontend - clone repo with frontend code and follow instructions there - https://github.com/Nikitapil/blog-platform
