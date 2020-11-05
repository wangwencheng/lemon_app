import proxyRequest from 'utils/request';

export async function buttonList(params) {
  return proxyRequest.get('/api/app/button/list', params);
}
