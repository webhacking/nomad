import Question from './question';
import Authorize from './authorize';
import Site from './constants/site';
import {concatMap} from "rxjs/operators";

const bootstrap = async () => {
    const {pickedSite, email, password} = await Question;
    const authorizer = new Authorize(Site[Object.keys(Site)[pickedSite]], email, password);
    console.log('로그인을 진행합니다.');
    authorizer.getAllCookies().pipe(
        concatMap(cookies => authorizer.verify(cookies))
    ).subscribe(res => {
        console.log('res', res);
    });
};

export default bootstrap;