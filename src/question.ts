import prompts, {Choice} from 'prompts';
import Site from "./constants/site";

export default prompts([
    {
        type:'select',
        name: 'pickedSite',
        message: '자동 프로세스를 진행할 서비스를 선택하세요.',
        choices: Object.values(Site).map((site, key) => ({title: site.name, value: key})) as Choice[]
    },
    {
        type: 'text',
        name: 'email',
        message: '가입하신 이메일을 입력해주세요.',
        validate: email => /\S+@\S+\.\S+/.test(email) ? true : '이메일 주소 형식을 다시 확인해주세요.',
        min: 1
    },
    {
        type: 'password',
        name: 'password',
        message: '가입하신 비밀번호를 입력해주세요.',
        min: 1
    },
    {
        type: 'toggle',
        name: 'value',
        message: '입력하신 정보로 작업을 진행할까요?',
        initial: true,
        active: '네',
        inactive: '아뇨, 다시 할래요.'
    }
]);
