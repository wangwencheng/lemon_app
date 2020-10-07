import React, {Component} from 'react';
import {connect} from 'dva';
import './index.less';
import classNames from 'classnames';
import {Toast, Modal, Button, List} from 'antd-mobile';
import {CSSTransition} from 'react-transition-group';
import router from 'umi/router';
import {baseUrl} from '@/utils/baseServer';
import {getToken} from "../../utils/token";
import {getCode} from "../../services/login";

class LoginNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '', // 电话
      phoneIsFocus: false, // 是否获取焦点
      phoneError: false, // 电话是否格式错误
      phoneCode: '', // 短信验证码
      phoneCodeIsFocus: false, // 是否获取焦点
      codeText: '获取验证码',
      isWait: false, // 是否在倒计时
      codeImageUrl: '', // 验证码图片
      visible: false
    };
    this.getCode = this.getCode.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {

  }

  // 协议弹窗
  showProtocol() {
    this.setState({
      visible: true
    });
  }

  close(v) {
    this.setState({
      visible: false
    });
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }


  /**
   * 倒计时
   */
  setTime() {
    this.setState({isWait: true});
    let countdown = 60
    this.setState({codeText: countdown + 's'});
    this.timer = setInterval(() => {
      if (countdown === 0) {
        this.setState({
          codeText: '重新获取',
          isWait: false
        });
        clearInterval(this.timer);
      } else {
        countdown--
        this.setState({codeText: countdown + 's'});
      }
    }, 1000)
  }

  /**
   * 获取短信验证码
   *  @return {Boolean} 当信息不完整时退出
   */
  getCode() {
    const {phone, phoneCode} = this.state;
    const {dispatch} = this.props;
    if (this.state.isWait) {
      return false
    }
    if (!this.checkData()) return
    // todo 像后端发起请求向指向手机号发验证码  /api/auth/code/sms
    let params = {};
    params.mobile = phone;
    params.from = 'APP';
    getCode(params).then(
      (result)=>{
        console.log(11)
      }
    )
      //   r => {
      //   if (r.code && r.code == 0) {
      //     Toast.success('验证码发送成功', 2);
      //     // 接口成功发送验证码并倒计时
      //     this.setTime()
      //   } else {
      //     Toast.fail('验证码发送失败', 2);
      //   }
      // }
  }


  /**
   * 登录
   * @return {Boolean} 当信息不完整时退出
   */
  submit() {
    // todo  请求后端登录接口   /api/mobile/token/sms
    Toast.fail('请完善登录逻辑', 2);
    //router.push('/home')
  }

  /**
   * 校验表单
   * @return {Boolean} 当信息不完整时退出
   */
  checkData() {
    if (!this.state.phone) {
      Toast.fail('请输入手机号码', 2);
      return false
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      Toast.fail('请输入正确的手机号', 2);
      this.setState({phoneError: true});
      return false
    }
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    // watch监听实时校验表单
    if (prevState.phone !== this.state.phone) {
      if (/^1[3456789]\d{9}$/.test(this.state.phone)) {
        this.setState({phoneError: false});
      }
    }
  }

  render() {
    const {phone, phoneIsFocus, phoneError, phoneCode, phoneCodeIsFocus, codeText, isWait} = this.state;
    return (
      <div className="login-bg">
        <div className="logo-wrap">
          <div className="logo"></div>
          <div className="welcome-wrap">
            <div className="hello">您好!</div>
            <div className="welcome">欢迎来到<span>lemon</span></div>
          </div>
        </div>
        <div className="form-wraper">
          <div className={classNames('input-wrap')}>
            <CSSTransition
              in={phone.length > 0}
              timeout={400}
              classNames="fade"
              unmountOnExit
            >
              <span>手机号</span>
            </CSSTransition>
            <CSSTransition
              in={phone.length > 0}
              timeout={400}
              classNames="input"
            >
              <input
                className={phoneError ? 'error' : ''}
                value={phone}
                onChange={e => {
                  if (e.target.value.length <= 11) {
                    this.setState({phone: e.target.value})
                  }
                }}
                onFocus={() => {
                  this.setState({phoneIsFocus: true});
                }}
                onBlur={() => {
                  this.setState({phoneIsFocus: false});
                }}
                type="text"
                placeholder="请输入手机号"/>
            </CSSTransition>
          </div>
          <Line show={phoneIsFocus}/>
          <div className={classNames('input-wrap-flex', 'margin-top-20')}>
            <div className="left">
              <CSSTransition
                in={phoneCode.length > 0}
                timeout={400}
                classNames="fade"
                unmountOnExit
              >
                <span>短信验证码</span>
              </CSSTransition>
              <CSSTransition
                in={phoneCode.length > 0}
                timeout={400}
                classNames="input"
              >
                <input
                  value={phoneCode}
                  onChange={e => {
                    this.setState({phoneCode: e.target.value});
                  }}
                  onFocus={() => {
                    this.setState({phoneCodeIsFocus: true});
                  }}
                  onBlur={() => {
                    this.setState({phoneCodeIsFocus: false});
                  }}
                  type="text"
                  placeholder="请输入短信验证码"/>
              </CSSTransition>
            </div>
            <div className="right">
              <span className={classNames('code-info', {'gray-info': isWait, 'active-info': codeText === '重新获取'})}
                    onClick={this.getCode}>{codeText}</span>
            </div>
          </div>
          <Line show={phoneCodeIsFocus}/>
        </div>
        <div className="login-wrap">
          <div className="login" onClick={this.submit}>登录/注册</div>
        </div>
        <p className="agree-wrap" onClick={(e) => {
          this.showProtocol();
        }}>登录或注册即代表您已同意<span className="agree">《用户注册协议》</span></p>
        {/*----协议----*/}
        <Modal
          popup
          visible={this.state.visible}
          animationType="slide-up"
          className="modal-service"
          platform={'android'}
          onClose={this.onClose('visible')}
          footer={[{
            text: '确 定', onPress: () => {
              console.log('ok');
              this.onClose('visible')();
            }
          }]}
        >
          <div className="modal-coupon-center" style={{height: 360}}>
            <h1>隐私政策</h1>
            <p>本应用尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，本应用会按照本隐私权政策的规定使用和披露您的个人信息。但本应用将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在未征得您事先许可的情况下，本应用不会将这些信息对外披露或向第三方提供。本应用会不时更新本隐私权政策。
              您在同意本应用服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于本应用服务使用协议不可分割的一部分。</p>
            <p>适用范围</p>
            <p>(a) 在您注册本应用帐号时，您根据本应用要求提供的个人注册信息；</p>
            <p>(b)
              在您使用本应用网络服务，或访问本应用平台网页时，本应用自动接收并记录的您的浏览器和计算机上的信息，包括但不限于您的IP地址、浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据；</p>
            <p>© 本应用通过合法途径从商业伙伴处取得的用户个人数据。</p>
            <p>您了解并同意，以下信息不适用本隐私权政策：</p>
            <p>(a) 您在使用本应用平台提供的搜索服务时输入的关键字信息；</p>
            <p>(b) 本应用收集到的您在本应用发布的有关信息数据，包括但不限于参与活动、成交信息及评价详情；</p>
            <p>© 违反法律规定或违反本应用规则行为及本应用已对您采取的措施。</p>
            <p>信息使用</p>
            <p>(a)本应用不会向任何无关第三方提供、出售、出租、分享或交易您的个人信息，除非事先得到您的许可，或该第三方和本应用（含本应用关联公司）单独或共同为您提供服务，且在该服务结束后，其将被禁止访问包括其以前能够访问的所有这些资料。</p>
            <p>(b) 本应用亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。任何本应用平台用户如从事上述活动，一经发现，本应用有权立即终止与该用户的服务协议。</p>
            <p>©为服务用户的目的，本应用可能通过使用您的个人信息，向您提供您感兴趣的信息，包括但不限于向您发出产品和服务信息，或者与本应用合作伙伴共享信息以便他们向您发送有关其产品和服务的信息（后者需要您的事先同意）。</p>
            <p>信息披露</p>
            <p>在如下情况下，本应用将依据您的个人意愿或法律的规定全部或部分的披露您的个人信息：</p>
            <p>(a) 经您事先同意，向第三方披露；</p>
            <p>(b)为提供您所要求的产品和服务，而必须和第三方分享您的个人信息；</p>
            <p>© 根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；</p>
            <p>(d) 如您出现违反中国有关法律、法规或者本应用服务协议或相关规则的情况，需要向第三方披露；</p>
            <p>(e) 如您是适格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；</p>
            <p>(f) 在本应用平台上创建的某一交易中，如交易任何一方履行或部分履行了交易义务并提出信息披露请求的，本应用有权决定向该用户提供其交易对方的联络方式等必要信息，以促成交易的完成或纠纷的解决。</p>
            <p>(g) 其它本应用根据法律、法规或者网站政策认为合适的披露。</p>
            <p>信息存储和交换</p>
            <p>本应用收集的有关您的信息和资料将保存在本应用及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或本应用收集信息和资料所在地的境外并在境外被访问、存储和展示。</p>
            <p>Cookie的使用</p>
            <p>(a)
              在您未拒绝接受cookies的情况下，本应用会在您的计算机上设定或取用cookies，以便您能登录或使用依赖于cookies的本应用平台服务或功能。本应用使用cookies可为您提供更加周到的个性化服务，包括推广服务。</p>
            <p>(b)
              您有权选择接受或拒绝接受cookies。您可以通过修改浏览器设置的方式拒绝接受cookies。但如果您选择拒绝接受cookies，则您可能无法登录或使用依赖于cookies的本应用网络服务或功能。</p>
            <p>© 通过本应用所设cookies所取得的有关信息，将适用本政策。</p>
            <p>信息安全</p>
            <p>(a)
              本应用帐号均有安全保护功能，请妥善保管您的用户名及密码信息。本应用将通过对用户密码进行加密等安全措施确保您的信息不丢失，不被滥用和变造。尽管有前述安全措施，但同时也请您注意在信息网络上不存在“完善的安全措施”。</p>
            <p>(b) 在使用本应用网络服务进行网上交易时，您不可避免的要向交易对方或潜在的交易对</p>
            <p>7.本隐私政策的更改</p>
            <p>(a)如果决定更改隐私政策，我们会在本政策中、本公司网站中以及我们认为适当的位置发布这些更改，以便您了解我们如何收集、使用您的个人信息，哪些人可以访问这些信息，以及在什么情况下我们会透露这些信息。</p>
            <p>(b)本公司保留随时修改本政策的权利，因此请经常查看。如对本政策作出重大更改，本公司会通过网站通知的形式告知。</p>
            <p>请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息泄密，尤其是本应用用户名及密码发生泄露，请您立即联络本应用客服，以便本应用采取相应措施。</p>
            <p>如您对本政策或其他相关事宜有疑问，请通过 http://118.24.241.234/ 与我们联系。您也可将您的问题发送至960075207@qq.com或寄到如下地址：</p>
            <p>地址：厦门市集美区 法务部 数据及隐私保护中心（收）</p>
            <p>邮编：361021。</p>
          </div>
        </Modal>
      </div>
    );
  }
}

// 分割线动画组件
class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="line-wrap">
        <CSSTransition
          in={this.props.show}
          timeout={500}
          classNames="line"
        >
          <div className="line"></div>
        </CSSTransition>
      </div>
    )
  }
}

export default LoginNew
