require('dotenv').config()

export default (config) => (
{
  expo: {
    name: "klutch-miniapp",
    slug: "klutch-miniapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "assets/**/*",
      "dist/templates/**/*"
    ],    
    "ios": {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      serverUrl: "https://sandbox.klutchcard.com/graphql",
      userPoolClientId: "32022akd8ldlkjkk5v4i5m8td3",
      userPoolServer: "https://cognito-idp.us-west-2.amazonaws.com/",
      MiniAppServerUrl: process.env.MiniAppServerUrl,
      RecipeInstallId: process.env.RecipeInstallId,
      RecipeId: process.env.RecipeId,
      userName: process.env.userEmail || process.env.userName,
      password: process.env.password
    }    
  }
}
)