export class Product {
    productId: number = 0;
    name: string = '';
    productNumber: string = '';
    color: string = '';
    standardCost : number = 0;
    listPrice: number = 0;
    size: string = '';
    weight: number = 0;
    productCategoryId: number = 0;
    productModelId: number = 0;
    sellStartDate: Date= new Date();
    sellEndDate: Date= new Date(); 
    discontinueDate: Date= new Date();
    thumbNailPhoto: string = '';
    thumbnailPhotoFileName: string = '';
    rowguid: string = '';
    modifiedDate: Date = new Date();
    productCategory : string = '';
    productModel : string = '';
    salesOrderDetails: any[] = [];
}