import  { verify } from 'jsonwebtoken'


const KLUTCH_PUBLIC_KEY: string = process.env.klutchpublickey || ""

export default new class Auth {
    auth(token: string): any {  
        return verify(token, KLUTCH_PUBLIC_KEY, {algorithms: ["RS256"]})
    }
}