import request from 'utils/request';

export async function getCode(params) {
  return request.get('/api/auth/code/sms', params);
}
