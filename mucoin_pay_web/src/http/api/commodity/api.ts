import httpService from '@/http/httpService';


export const getCommodity = (categoryID: number): Promise<any> => {
  const params = {
    categoryID: categoryID,
  };
    return httpService.get<any>('/commodity/public/query',{params});
  };