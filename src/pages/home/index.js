import React, {Component} from 'react';
import {connect} from 'dva';
import {SearchBar, Modal, ListView} from 'antd-mobile';
import Link from 'umi/link';
import router from 'umi/router';
import styles from './index.less';
import ReactDOM from 'react-dom';


function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{display: 'none'}}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

const data = [
  {
    img: 'https://articles.csdn.net/uploads/allimg/110527/16354R640-1.jpg',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://pic1.zhimg.com/80/v2-b91fb22a36fa3e11a7a7e4dd71cae90c_1440w.jpg',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://articles.csdn.net/uploads/allimg/110527/16354R640-1.jpg',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];
const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

function genData(pIndex = 0) {
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const ii = (pIndex * NUM_SECTIONS) + i;
    const sectionName = `Section ${ii}`;
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[ii] = [];

    for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
      const rowName = `S${ii}, R${jj}`;
      rowIDs[ii].push(rowName);
      dataBlobs[rowName] = rowName;
    }
  }
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}

@connect(({home}) => ({home}))
class Home extends Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
      banner: [],
      icon: [],
      tab: [],
      bottomBanner: [],
      buttonMenuList: [],
      cardLists: [],
      tofobanner: [],
      visible: false,
    }
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    // simulate initial Ajax
    setTimeout(() => {
      genData();
      this.setState({
        buttonMenuList: this.props.home.buttonMenuList,
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs),
        isLoading: true,
        height: hei,
      });
    }, 600);
  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({isLoading: true});
    setTimeout(() => {
      genData(++pageIndex);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs),
        isLoading: false,
      });
    }, 1000);
  }

  buttonLink(link) {
    console.log(link)
  }

  renderButton = () => {
    let buttonMenuList = this.state.buttonMenuList;
    return buttonMenuList.map((button, index) => {
      return <span className='spanButton' key={index}>
                <a onClick={() => this.buttonLink(button.buttonLocation)}>
                  <font color="black">{button.buttonName}</font>
                </a>
             </span>
    })
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: '30px',
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}>
        日垚是傻逼
      </div>
    );
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={rowID} style={{paddingTop: "2px", height: '200'}}>
          <img src={obj.img}/>
        </div>
      )
    };
    return (
      <div className='homePage'>
        <div className='homePage_search'>
          <div className='homePage_input'>
            <SearchBar
              placeholder="搜索你想要视频"
              ref={ref => this.manualFocusInst = ref}
              onFocus={() => router.push('/search')}
            />
          </div>
          <div className='homePage_search_ico' onClick={() => router.push('/class')}>
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
          onScroll={() => {
            console.log('scroll');
          }}
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
