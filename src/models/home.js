import { buttonList } from 'services/home';
import router from 'umi/router';
export default {
  namespace: 'home',
  state: {
    buttonMenuList:[]
  },
  effects: {
    *buttonList({ payload, callback }, { call, put }) {
      const response = yield call(buttonList, payload);
      yield put({
        type: 'setData',
        payload: response.data
      });
    }
  },
  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        buttonMenuList: payload,
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname == '/home'||pathname == '/') {
          dispatch({
            type: 'buttonList',
          });
        }
      });
    },
  },
};
