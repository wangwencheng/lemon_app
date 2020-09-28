import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal } from 'antd-mobile';
import NameCard from '../../components/name-card';
import OrderStatus from '../../components/order-status';
import router from 'umi/router';
import styles from './index.less';

@connect(({ my }) => ({ my }))
class MyIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowdata: 0,
      name: '登录/注册',
      avatar:'',
      not_login: false
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;

  }
  linkurl(v){
    if (v === 'about') {
      console.log('去关于我们咯')
    } else {
      console.log('去设置中心咯')
    }
  }
  render() {
    const { my } = this.props;
    const { not_login } = this.state;
    return (
      <div className={styles.content_me}>
        <NameCard
          name={not_login ? JSON.parse(localStorage.getItem('USER_INFO')).name : '登录/注册'}
          avatar={this.state.avatar}
          notLogin={not_login ? 1 : 0}
        />
        { !my.list.data && <OrderStatus countList={0} />}
        { my.list.data && <OrderStatus countList={my.list.data} />}
        <div className={styles.service_info + ' ' + 'box_shadow'}>
          <div className={styles.service_title + ' ' + 'border_bottommin'}>用户帮助</div>
          <div className={styles.service_content}>
            <div className={styles.service_item} onClick={() => this.linkurl('about')}>
              <img
                className={styles.service_img}
                src={require('../../assets/recycleH5_17.png')}
                alt=""
              />
              <div className={styles.service_text}>关于我们</div>
            </div>
            <div className={styles.service_item} onClick={() => {console.log('帮助中心')}}>
              <img
                className={styles.service_img}
                src={require('../../assets/recycleH5_19.png')}
                alt=""
              />
              <div className={styles.service_text}>帮助中心</div>
            </div>
            <div className={styles.service_item} onClick={() => this.linkurl('setting')}>
              <img
                className={styles.service_img}
                src={require('../../assets/recycleH5_18.png')}
                alt=""
              />
              <div className={styles.service_text}>设置</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default MyIndex;