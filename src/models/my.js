import { buttonList } from 'services/my';
import router from 'umi/router';
export default {
  namespace: 'my',
  state: {
    list: ''
  },
  effects: {
    *buttonList({ payload, callback }, { call, put }) {
      const response = yield call(buttonList, payload);
      if(!response){
        return;
      }
      yield put({
        type: 'setData',
        payload: response
      });
      if (response) {
        callback(response);
      }
    },
  },
  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        list: payload,
      }
    },
  }
};
