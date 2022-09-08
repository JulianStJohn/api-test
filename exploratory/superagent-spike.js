// https://visionmedia.github.io/superagent/
import  request from 'superagent' // require('superagent')
import { prettyPrint } from '@base2/pretty-print-object';


export const version = () => {
    return "v0.1"
}

// Cookies and request.agent()
// In Node SuperAgent does not save cookies by default, but you can use the .agent() method to create a copy of SuperAgent that saves cookies.
// However I found some discrepancies in calls: 
//   * calls to 'www.realestate.com.au' will not respond with 'set-cookie when made from request.agent().get, 
//   * but calls to 'www.realestate.com.au' will respond with 'set-cookie' when made from request.get, 
//   * calls to 'https://www.realestate.com.au' will respond with 'set-cooki when made from request.agent().get, 
// So I'm using my own custom cookie jar: 

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
        Cookie syntax from: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
        Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>;  Max-Age=<number>; Domain=<domain-value>; Path=<path-value>; SameSite=<value>; Secure; HttpOnly;
        
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
        if (this.cookies[hostName] === undefined) return "";
        return (this.cookies[hostName].length == 1) ? this.cookies[hostName][0] : this.cookies[hostName].join("; ") + ";" ;
       this.cookies[hostName].join("; ")
    }
}


// where using superagent to request an html endpoint, text() returns the data

//const cookiedUrl = "https://www.google.com"
const cookiedUrl = "https://www.realestate.com.au"
//const cookiedUrl = "www.realestate.com.au"
//const cookiedUrl = "www.google.com"
const cookieJar = new CookieJar(); 

export const getSetCookieHeaderFromResponse = async (url, cookieJar) => {
    let storedCookies =  cookieJar.getCookies(url) 
    let headers = (storedCookies == "") ? { } : { 'Cookie' : storedCookies }
    let response = await request.get(url).set(headers)
    let setCookieHeader = await response.headers['set-cookie'] 
    if(setCookieHeader.length > 0) setCookieHeader.map((cookieString) => {cookieJar.addCookie(url, cookieString); }); 
    return setCookieHeader; 

     // res.body, res.headers, res.status
       // console.log(res.body)
       // console.log(res.text)
       //console.log("request() response:")
        // console.log(prettyPrint(Object.keys(res)))

}
console.log("Where storing cookies, ")
console.log("The first call should return all cookies in set-cookies:\n" + await getSetCookieHeaderFromResponse(cookiedUrl, cookieJar))
console.log("The second call should return a subset of, or nil, cookies in set-cookies:\n" + await getSetCookieHeaderFromResponse(cookiedUrl, cookieJar))






