export class UpdatedProduct{
    name: string|null = '';
    productNumber: string|null = '';
    color: string|null = '';
    standardCost : number|null = 0;
    listPrice: number|null = 0;
    size: string|null = '';
    weight: number|null = 0;
    productCategoryId: number|null= 0;
    productModelId: number|null = 0;
    sellStartDate: Date|null= new Date();
    sellEndDate: Date|null= new Date(); 
    discontinuedDate: Date|null= new Date();
    thumbnailPhotoFileName: string|null = '';
    thumbnailPhoto: string|null = '';
    
}