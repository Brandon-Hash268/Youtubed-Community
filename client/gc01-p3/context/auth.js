import * as React from "react"

export const AuthContext = React.createContext({
    signedIn:false,
    setSignedIn:()=>{}
})