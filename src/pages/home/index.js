import React, {Component} from 'react';
import {connect} from 'dva';
import {SearchBar, Modal, Flex} from 'antd-mobile';
import HomeCarousel from '../../components/home-tabbar/home-tabber-carousel'
import Link from 'umi/link';
import router from 'umi/router';
import styles from './index.less';

@connect(({home}) => ({home}))
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      banner: [],
      icon: [],
      tab: [],
      bottomBanner: [],
      loinBannerList: [],
      cardLists: [],
      tofobanner: [],
      visible: false,
    }
  }

  bannerLink(link) {
    console.log(link)
  }

  render() {
    const {home} = this.props;
    return (
      <div className='homePage'>
        <div className='homePage_search'>
          <div className='homePage_input'>
            <SearchBar
              placeholder="搜索你想要的商品"
              ref={ref => this.manualFocusInst = ref}
              onFocus={() => router.push('/search')}
            />
          </div>
          <div className='homePage_search_ico' onClick={() => router.push('/class')}>
            <img src={require('../../assets/icon-classify.png')}/>
          </div>
        </div>
        <div className='btnDiv'>
          <span className='spanButton'>
            <a onClick={() => this.bannerLink("http:www.baidu.com")}>
              <font color="black">推荐</font>
            </a>
          </span>
          <span className='spanButton'>
            <a onClick={() => this.bannerLink("http:www.baidu.com")}>
              <font color="black">热点</font>
            </a>
          </span>
        </div>
        <div className='stepBlock'>
          <div className='stepBlockimg'>四步变现</div>
          <img className='stepBlockimg' onClick={() => router.push('/class')}
               src={require('../../assets/recycleH5_01.png')} alt=""/>
        </div>
        <div className='stepBlock'>
          <div className='stepBlockimg'>四步变现</div>
          <img className='stepBlockimg' onClick={() => router.push('/class')}
               src={require('../../assets/recycleH5_01.png')} alt=""/>
        </div>
        <Modal
          visible={this.state.visible}
          transparent
          closable={true}
          maskClosable={true}
          className="modal-shool"
          onClose={() => this.onClose()}
        >
          <img src="http://res.zudeapp.com/allh5/buyput-renew-icon.png" alt=""
               onClick={() => router.push("/indexActivity")}/>
        </Modal>
      </div>
    )
  }
}


export default Home;
