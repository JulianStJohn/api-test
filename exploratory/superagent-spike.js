// https://visionmedia.github.io/superagent/
import request from 'superagent' 
import CookieJar from '../shared/cookiejar.js'
import { prettyPrint } from '@base2/pretty-print-object';

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






