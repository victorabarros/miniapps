import { AlloyJS, AuthService } from "@alloycard/alloy-js"


export default async function klutch() {
    AlloyJS.config({
        serverUrl: "http://sandbox.klutchcard.com",        
    })

    const authKeys = await AuthService.signIn(email, password)
    
}

