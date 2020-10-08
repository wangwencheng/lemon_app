import proxyRequest from 'utils/request';

export async function getCode(params) {
  return proxyRequest.get('/api/auth/code/sms', params);
}
