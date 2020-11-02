import proxyRequest from 'utils/request';


export async function videoInfo() {
  return proxyRequest.get('/api/app/video/info', null);
}
