import { ExpoConfig, ConfigContext } from '@expo/config';

require('dotenv').config()


export default ({ config }) => (
{
  "expo": {
    "name": "klutch-miniapp",
    "slug": "klutch-miniapp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "assets/**/*",
      "dist/templates/**/*"
    ],    
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },  
    "extra": {
      "serverUrl": process.env.serverUrl,
      "privateKey": process.env.privateKey,
      "userPoolClientId": process.env.userPoolClientId,
      "userPoolServer": process.env.userPoolServer,
      "userName": process.env.userName,
      "password": process.env.password
    }
  }
})