import proxyRequest from 'utils/request';


export async function videoInfo(params) {
  return proxyRequest.get('/api/app/video/info', params);
}
