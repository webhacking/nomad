export type SiteModelUnit = {
    name: string,
    listURI: string,
    authorizeURI: string
}

export interface SiteModel {
    [key: string]: SiteModelUnit;
}

const Site: SiteModel = {
    wishket: {
        name: '위시캣',
        listURI: 'https://www.wishket.com/',
        authorizeURI: 'https://www.wishket.com/accounts/login/'
    },
    freemoa: {
        name: '프리모아',
        listURI: 'https://www.freemoa.net/m4/s41?page=1',
        authorizeURI: ''
    }
};

export default Site;