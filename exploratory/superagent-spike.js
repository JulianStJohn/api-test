// https://visionmedia.github.io/superagent/
import  request from 'superagent' // require('superagent')
import { prettyPrint } from '@base2/pretty-print-object';


export const version = () => {
    return "v0.1"
}




export class CookieJar {

    // First version of this class discards most of the information and just saves the 
    // cookie under the hostname. 

    constructor() {
        // store cookies as a key value pair - key is the domain for the time being
        this.cookies = {};
        this.cookieInformationKeys = ['Expires','Max-Age','Domain','Path','SameSite','securityPolicy']
    }
    parseCookieString(cookieString){
        /* 
        From: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
        
        Possible cookie types to parse: 
        
        Set-Cookie: <cookie-name>=<cookie-value>
        Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
        Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<number>
        Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
        Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
        Set-Cookie: <cookie-name>=<cookie-value>; Secure
        Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly
        Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
        Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax
        Set-Cookie: <cookie-name>=<cookie-value>; SameSite=None; Secure

        // Multiple attributes are also possible, for example:
        Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
     
        parseCookieString returns an object with the cookie key value pairs: 
        {
            id: 'abc',
            expires: 'Mon, 31-Dec-2038 23:59:59 GMT',
            path: '/',
            domain: '.test.com.au',
            securityPolicy: [
                'Secure',
                'HttpOnly'
            ]
        }
        */
        const cookieValues = {}
        cookieString.split(';').map((cookieFragment) => {
            cookieFragment = cookieFragment.trim();
            if (cookieFragment == "") return;
            if(cookieFragment.includes("=")){
                const [key, ...value]=cookieFragment.split("=");
                cookieValues[key] = value.join('');
            }else{
                if (cookieValues['securityPolicy'] === undefined) cookieValues['securityPolicy'] = []; 
                cookieValues['securityPolicy'].push(cookieFragment);
            }
        });
        //console.log(prettyPrint(cookieValues))
        return cookieValues;
    }
    getCookieKeyFromParsedCookie(parsedCookie){
        return Object.keys(parsedCookie).filter((key) => { return !this.cookieInformationKeys.includes(key) })[0];
    }
    getHostNameFromUrl(url){
        const urlObject = new URL(url);
        const hostName = urlObject.hostname;
        return hostName
    }
    addCookie(url,  cookieString){
        const hostName = this.getHostNameFromUrl(url)
        const parsedCookie = this.parseCookieString(cookieString)
        const cookieKey = this.getCookieKeyFromParsedCookie(parsedCookie)
        const cookieKeyValueString = `${cookieKey}=${parsedCookie[cookieKey]}` 
        if (this.cookies[hostName] === undefined ) this.cookies[hostName] = []
        this.cookies[hostName].push(cookieKeyValueString) 
    }
    getCookies(url){
        //console.log(prettyPrint(this.cookies)) 
        const hostName = this.getHostNameFromUrl(url)
        return this.cookies[hostName].join("; ")
    }
}


// where using superagent to request an html endpoint, text() returns the data

//const cookiedUrl = "https://www.google.com"
const cookiedUrl = "https://www.realestate.com.au"
//const cookiedUrl = "www.realestate.com.au"
//const cookiedUrl = "www.google.com"

await request
.get(cookiedUrl)
.then(res => {
   // res.body, res.headers, res.status
   // console.log(res.body)
   // console.log(res.text)
   console.log("request() response:")
   //console.log(prettyPrint(Object.keys(res)))
   console.log(res.headers['set-cookie'])
})
.catch(err => {
   // err.message, err.response
   console.log(err.message)
});


// Cookies and request.agent()
// In Node SuperAgent does not save cookies by default, but you can use the .agent() method to create a copy of SuperAgent that saves cookies.
// However I found some discrepancies in calls: 
//   * calls to 'www.realestate.com.au' will not respond with 'set-cooki when made from request.agent().get, 
//   * but calls to 'www.realestate.com.au' will respond with 'set-cookie' when made from request.get, 
//   * calls to 'https://www.realestate.com.au' will respond with 'set-cooki when made from request.agent().get, 

const agent = request.agent();
await agent
.get(cookiedUrl)
.then(data => {
    console.log("agent.request() response:")
    
    console.log(data.headers['set-cookie'])
})

const secondRequest = () => {

}

await agent
.get(cookiedUrl)
.then(data => {
    console.log("agent.request() response 2:")
    console.log(prettyPrint(data.req['_header']))
    //console.log(prettyPrint(Object.keys(data.headers)))
    console.log(data.headers['set-cookie'])
})



