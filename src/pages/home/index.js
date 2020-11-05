import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Toast, SearchBar, Modal, ListView} from 'antd-mobile';
import {videoInfo} from "../../services/video";
import router from 'umi/router';
import {buttonList} from '../../services/home';
import styles from './index.less';
import {
  Player,
  ControlBar,
  PlayToggle, // PlayToggle 播放/暂停按钮 若需禁止加 disabled
  ReplayControl, // 后退按钮
  ForwardControl,  // 前进按钮
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,  // 倍速播放选项
  VolumeMenuButton
} from 'video-react';
import "video-react/dist/video-react.css"; // import css


function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{display: 'none'}}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}


@connect(({home}) => ({home}))
class Home extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      videoList: [],
      pageNo: 1,
      pageSize: 2,
      hasMore: true,
      refreshing: true,
      buttonMenuList: [],
      visible: false,
      height: document.documentElement.clientHeight - (document.documentElement.clientWidth * 74 / 375),
    }
  }

  componentDidMount() {
    const para = {}
    para.pageSize = this.state.pageSize
    para.pageNo = 1
    this.getData(true, para)
  }

  getData(ref = false, params) {
    //获取数据
    videoInfo(params).then((result) => {
      if (result && result.code === 0) {
        const dataList = result.data.records
        const len = dataList.length
        if (len <= 0) {                                // 判断是否已经没有数据了
          this.setState({
            refreshing: false,
            isLoading: false,
            hasMore: false
          })
          Toast.info('没有数据了~', 1)
          return false
        }

        if (ref) {
          //这里表示刷新使用
          // 下拉刷新的情况，重新添加数据即可(这里等于只直接用了第一页的数据)
          this.setState({
            pageNo: this.state.pageNo,
            dataSource: this.state.dataSource.cloneWithRows(dataList), // 数据源中的数据本身是不可修改的,要更新datasource中的数据，请（每次都重新）调用cloneWithRows方法
            hasMore: true, // 下拉刷新后，重新允许开下拉加载
            refreshing: false, // 是否在刷新数据
            isLoading: false, // 是否在加载中
            videoList: dataList // 保存数据进state，在下拉加载时需要使用已有数据
          })
        } else {
          // 这里表示上拉加载更多
          // 合并state中已有的数据和新增的数据
          const dataArr = this.state.videoList.concat(dataList) //关键代码
          this.setState({
            pageNo: this.state.pageNo,
            dataSource: this.state.dataSource.cloneWithRows(dataArr), // 数据源中的数据本身是不可修改的,要更新datasource中的数据，请（每次都重新）调用cloneWithRows方法
            refreshing: false,
            isLoading: false,
            videoList: dataArr // 保存新数据进state
          })
        }

      }
    })
  }

  componentWillMount() {
    buttonList().then((result) => {
      if (result && result.code === 0) {
        this.setState({
          buttonMenuList: result.data
        })
      }
    })
  }

  // 滑动到底部时加载更多
  onEndReached = (event) => {
    // 加载中或没有数据了都不再加载
    if (this.state.isLoading || !this.state.hasMore) {
      return
    }
    this.setState({
      isLoading: true,
      pageNo: this.state.pageNo + 1, // 加载下一页
    }, () => {
      const para = {}
      para.pageSize = this.state.pageSize
      para.pageNo = this.state.pageNo
      this.getData(false, para)
    })
  }

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1 // 刷新嘛，一般加载第一页，或者按你自己的逻辑（比如每次刷新，换一个随机页码）
    }, () => {
      const para = {}
      para.pageSize = this.state.pageSize
      para.pageNo = this.state.pageNo
      this.getData(true, para)
    })
  }

  buttonLink(link) {
    const para = {}
    para.pageSize = this.state.pageSize
    para.pageNo = 1
    para.videoType = link;
    this.getData(true, para)
  }

  reloadVideo = data => {
    console.log('data', data)
  }

  renderButton = () => {
    let buttonMenuList = this.state.buttonMenuList;
    if (buttonMenuList == null) {
      router.push("login");
      return;
    }
    return buttonMenuList.map((button, index) => {
      return <span className='spanButton' key={index}>
                <a onClick={() => this.buttonLink(button.buttonType)}>
                  <font color="black">{button.buttonName}</font>
                </a>
             </span>
    })
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`} className='separator_div'>
        <span style={{width: 50, marginLeft: 5}}>
          <span><img src={require('../../assets/view.jpg')} width={20} height={15}/></span>
          <span>190.3万</span>
        </span>
        <span style={{width: 50, marginLeft: 5}}>
          <span><img src={require('../../assets/thump.jpg')} width={20} height={15}/></span>
          <span>36</span>
        </span>
        <span style={{width: 50, marginLeft: 5}}>
          <span><img src={require('../../assets/reply.jpg')} width={20} height={15}/></span>
          <span>6</span>
        </span>
        <span style={{float: "right", width: 50, marginLeft: 5}}>
          <span><img src={require('../../assets/weixin.jpg')} width={20} height={25}/></span>
          <span style={{writingMode: "tb-rl", fontFamily: "italic", fontWeight: 700, marginTop: 5,marginLeft:5}}>...</span>
        </span>
      </div>
    );

    const row = (rowData, sectionID, rowID) => {
      return (
        <Fragment>
          <div key={rowID} className='videoDiv'>
            <Player
              ref={c => {
                this.player = c;
              }}
              fluid={false}
              width={'100%'}
              height={298}
              //  preload={'metadata'}
              poster={rowData.videoThumbnail}
              //   aspectRatio={'1:1'}     //视频宽高比
            >
              <source
                src={rowData.videoUrl}
                type="video/mp4"
              />
              <ControlBar autoHide={false} disableDefaultControls={false}>
                <ReplayControl seconds={10} order={1.1}/>
                <ForwardControl seconds={30} order={1.2}/>
                <PlayToggle/>
                <CurrentTimeDisplay order={4.1}/>
                <TimeDivider order={4.2}/>
                <PlaybackRateMenuButton rates={[5, 2, 1.5, 1, 0.5]} order={7.1}/>
                <VolumeMenuButton/>
              </ControlBar>
            </Player>
          </div>
        </Fragment>
      )
    };
    return (
      <div className='homePage'>
        <div className='homePage_search'>
          <div className='homePage_input'>
            <SearchBar
              placeholder="搜索你想要视频"
              ref={ref => this.manualFocusInst = ref}
              onSubmit={value => {
                const para = {}
                para.pageSize = this.state.pageSize
                para.pageNo = this.state.pageNo
                para.videoName = value;
                this.getData(true, para)
              }}
            />
          </div>
          <div className='homePage_search_ico' onClick={(e) => {
            this.reloadVideo(e);
          }}>
            <img src={require('../../assets/icon-classify.png')}/>
          </div>
        </div>
        <div className='btnDiv'>
          {this.renderButton()}
        </div>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          //renderHeader={() => <span>header</span>}
          renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
            {this.state.isLoading ? 'Loading...' : 'Loaded'}
          </div>)}
          renderBodyComponent={() => <MyBody/>}
          renderRow={row}
          renderSeparator={separator}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          pageSize={4}
          //onScroll={() => {console.log('scroll');}}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
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

export default connect()(Home);
