import { CookieJar } from "./superagent-spike.js";
import { strict as assert } from 'node:assert';
 
const jar = new CookieJar();

describe('CookieJar Class', function () {
  describe('parseCookieString()', function () {
    const cookieString = "id=abc; expires=Mon, 31-Dec-2038 23:59:59 GMT; path=/; domain=.test.com.au; Secure; HttpOnly;";
    const jar = new CookieJar()
    it('when parsing a valid cookie string, should return cookie key value pair in hash', function () {
      assert.equal(jar.parseCookieString(cookieString)['id'], "abc");
    });
    it('when parsing a valid cookie string with a domain, should return domain key value pair in hash', function () {
        assert.equal(jar.parseCookieString(cookieString)['domain'], ".test.com.au");
    });
    it('when parsing a valid cookie string with security keywords, should return security keywords in an array with key "securityPolicy"', function () {
        assert.deepEqual(jar.parseCookieString(cookieString)['securityPolicy'], ['Secure','HttpOnly']);
    });

  });
});