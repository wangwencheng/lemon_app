import proxyRequest from 'utils/request';
import { baseUrl } from '@/utils/baseServer';

export async function buttonList(params) {
  return proxyRequest.get('/api/app/button/list', params);
}
