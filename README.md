# rails-react-webpack-demo

Replace assets pipeline and [rails-react](https://github.com/reactjs/react-rails) with webpack

## Requirements

* node ([nvm](https://github.com/creationix/nvm) recommended)

## Install

    bundle
    cd frontend
    npm i

## Starting
    
    rails s
    cd frontend
    npm start
    open http://localhost:3000

## Deployment to heroku

    heroku buildpacks:clear
    heroku buildpacks:set heroku/nodejs
    heroku buildpacks:add heroku/ruby --index 2
    git push heroku master
    open https://rails-react-webpack-demo.herokuapp.com
