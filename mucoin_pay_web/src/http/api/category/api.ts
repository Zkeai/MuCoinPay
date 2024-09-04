import httpService from '@/http/httpService';



export const getCategory = (userID: string): Promise<any> => {
  const params = {
    userID: userID,
  };
    return httpService.get<any>('/category/public/query',{params});
  };