export class Campus{
    constructor(
        public name: string,
        public open: boolean,
        public address: string,
        public city: string,
        public phoneNumber: string,
        public apiLink: string,
        public openDate: Date,
    ){}
}