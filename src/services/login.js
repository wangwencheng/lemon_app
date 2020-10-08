import proxyRequest from 'utils/request';

export async function getCode(params) {
  return proxyRequest.get('/api/auth/code/sms', params);
}

export async function login(params) {
  return proxyRequest.post('/api/auth/mobile/token/sms', params);
}
