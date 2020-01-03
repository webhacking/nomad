import {SiteModelUnit} from './constants/site';
import { from, of} from "rxjs";
import axios from 'axios';
import {concatAll, concatMap, filter, map, pluck, tap} from "rxjs/operators";
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough, {Cookie} from 'tough-cookie';
import UserAgent from 'user-agents';

class Authorize {
    private readonly site!: SiteModelUnit;
    private readonly id!: string;
    private readonly pw!: string;

    public constructor(site: SiteModelUnit, id: string, pw: string) {
        this.site = site;
        this.id = id;
        this.pw = pw;
    }

    public getAllCookies() {
        const cookieJar = new tough.CookieJar();
        return from(axiosCookieJarSupport(axios).get(this.site.authorizeURI, {
            withCredentials: true,
            jar: cookieJar
        })).pipe(
            tap(res => console.log('res', res.headers['set-cookie'])),
            map(() => cookieJar.toJSON()),
            pluck('cookies'),
        );
    }

    public getCsrfTokenFromCookies(cookies: Cookie.Serialized[]) {
        return of(cookies).pipe(
            concatAll(),
            filter(cookie => cookie.key === 'csrftoken'),
            pluck('value')
        );
    }

    public verify(cookies: Cookie.Serialized[]) {
        console.log({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': this.site.authorizeURI,
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'User-Agent': new UserAgent().toString(),
            'Cookie': cookies.map(cookie => `${cookie.key}=${cookie.value}`)
        })
        return this.getCsrfTokenFromCookies(cookies).pipe(
            concatMap(csrfmiddlewaretoken => {
                return from(axios.post(this.site.authorizeURI, {
                    identification: this.id,
                    password: this.pw,
                    csrfmiddlewaretoken
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': this.site.authorizeURI,
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-origin',
                        'Sec-Fetch-User': '?1',
                        'User-Agent': new UserAgent().toString(),
                        'Cookie': cookies.map(cookie => `${cookie.key}=${cookie.value}`)
                    }
                }));
            })
        )
    }
}

export default Authorize;
