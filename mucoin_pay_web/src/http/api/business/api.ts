import httpService from '@/http/httpService';


export const getBuinessConfig = (): Promise<any> => {
    return httpService.get<any>('/business/public/query');
  };