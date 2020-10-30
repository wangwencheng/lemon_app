import proxyRequest from 'utils/request';


export async function userInfo() {
  return proxyRequest.get('/api/user/info', null);
}
