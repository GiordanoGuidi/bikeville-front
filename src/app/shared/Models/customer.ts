export class Customer {
    customerId: number = 0;
    nameStyle: boolean = false;
    title: string = "";
    firstName: string = "";
    middleName: string = "";
    lastName: string = "";
    suffix: string = "";
    companyName: string = "";
    salesPerson: string = "";
    emailAddress: string = "";
    phone: string = "";
    passwordHash: string = "";
    passwordSalt: string = "";
    rowguid: string = "";
    modifiedDate: Date = new Date();
    customerAddresses: string[] = [];
    salesOrderHeaders: string[] = [];
}