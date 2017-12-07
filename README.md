# travel-logger-app

THIS IS SAMPLE APP of react-native (only testing android)

## Run App

```bash
$ npm install
$ react-native run-android
```

## Generate Polyline Map

```bash
$ cd misc
$ bundle install --path vendor/bundle
$ cp config.sample.yml config.local.yml
$ vim config.local.yml
---
google_api_key: 'YOUR API KEY'
$ bundle exec ruby map.rb --location /path/to/location_log --output map.html
```
