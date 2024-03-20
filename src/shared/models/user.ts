export class User{
    constructor(
        public firstName: string,
        public lastName: string,
        public address: string,
        public city: string,
        public provence: string,
        public postalCode: string,
        public phoneNumber: string,
        public firstDay: Date,
        public jobTitle?: string,
        public middleName?: string,
        public campus?: any,
    ){}
}