/* eslint-disable no-script-url,no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Upload,
  Button,
  Icon,
  Divider,
  Modal,
  message,
} from 'antd';
import device from './images/device.png';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import defaultHomeIcon from './images/home.png';
import defaultOpenningIcon from './images/openning.png';
import defaultEndIcon from './images/end.png';
import defaultMineIcon from './images/mine.png';
import defaultHomeIconActive from './images/home-o.png';
import defaultOpenningIconActive from './images/openning-o.png';
import defaultEndIconActive from './images/end-o.png';
import defaultMineIconActive from './images/mine-o.png';
import styles from './index.less';

const { confirm } = Modal;
const namespace = 'app';
const uploadArr = [
  {
    name: '首页',
    icon: 'homeIcon',
    iconActive: 'homeIconActive',
    isActive: true,
  },
  {
    name: '在开课程',
    icon: 'openningIcon',
    iconActive: 'openningIconActive',
  },
  {
    name: '已开课程',
    icon: 'endIcon',
    iconActive: 'endIconActive',
  },
  {
    name: '我的',
    icon: 'mineIcon',
    iconActive: 'mineIconActive',
  },
];

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const getIcon = (arr, key, defaultKey) => {
  if (arr.length > 0) {
    if (arr.find(item => item.iconImg === defaultKey)) {

      return false;
    } else {
      return `${arr.find(item => item.iconId === key).baseHost}/${arr.find(item => item.iconId === key).iconImg}`;
    }
  }
  return false;
};

/* eslint react/no-multi-comp:0 */
@connect(({ app, loading }) => ({
  app,
}))

class App extends Component {
  constructor(props) {
    super(props);
    const { [namespace]: { icons } } = props;
    this.state = {
      homeIcon: getIcon(icons, 'homeIcon', 'defaultHomeIcon') || defaultHomeIcon,
      homeIconActive: getIcon(icons, 'homeIconActive', 'defaultHomeIconActive') || defaultHomeIconActive,
      openningIcon: getIcon(icons, 'openningIcon', 'defaultOpenningIcon') || defaultOpenningIcon,
      openningIconActive: getIcon(icons, 'openningIconActive', 'defaultOpenningIconActive') || defaultOpenningIconActive,
      endIcon: getIcon(icons, 'endIcon', 'defaultEndIcon', 'defaultEndIcon') || defaultEndIcon,
      endIconActive: getIcon(icons, 'endIconActive', 'defaultEndIconActive') || defaultEndIconActive,
      mineIcon: getIcon(icons, 'mineIcon', 'defaultMineIcon') || defaultMineIcon,
      mineIconActive: getIcon(icons, 'mineIconActive', 'defaultMineIconActive') || defaultMineIconActive,
      loading: false,
      files: new FormData(),
      filesKeys: [],
    };
  }

  updateIcon = (icons) => {
    this.setState(() => (
      {
        homeIcon: getIcon(icons, 'homeIcon', 'defaultHomeIcon') || defaultHomeIcon,
        homeIconActive: getIcon(icons, 'homeIconActive', 'defaultHomeIconActive') || defaultHomeIconActive,
        openningIcon: getIcon(icons, 'openningIcon', 'defaultOpenningIcon') || defaultOpenningIcon,
        openningIconActive: getIcon(icons, 'openningIconActive', 'defaultOpenningIconActive') || defaultOpenningIconActive,
        endIcon: getIcon(icons, 'endIcon', 'defaultEndIcon', 'defaultEndIcon') || defaultEndIcon,
        endIconActive: getIcon(icons, 'endIconActive', 'defaultEndIconActive') || defaultEndIconActive,
        mineIcon: getIcon(icons, 'mineIcon', 'defaultMineIcon') || defaultMineIcon,
        mineIconActive: getIcon(icons, 'mineIconActive', 'defaultMineIconActive') || defaultMineIconActive,
      }
    ));
  };

  showConfirm = () => {
    confirm({
      title: '确定要发布？',
      content: '点击确定发布',
      onOk: () => this.handlerSaveClick(),
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/featchIcons`,
      callback: this.updateIcon,
    });
  }

  beforeUpload = (file, item, isChange = false) => {
    const { files } = this.state;
    const formData = files;
    const { icon, iconActive } = item;
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('文件必须小于2M!');
    //   return false;
    // }

    const isJpgOrPng = file.type === 'image/png'|| file.type === 'image/svg+xml';
    if (!isJpgOrPng) {
      message.error('图片格式有误，必须为PNG或SVG');
      return
    }

    const getKeys = (key) => {
      const { filesKeys } = this.state;
      if (!filesKeys.includes(key)) {
        filesKeys.push(key);
      }
      return filesKeys;
    };

    getBase64(file, photoPath => {
        if (isChange) {
          this.setState({
            [icon]: photoPath,
            loading: false,
            filesKeys: getKeys(`${icon}`),
          });
          formData.append(`${icon}`, file);
        } else {
          this.setState({
            [iconActive]: photoPath,
            loading: false,
            filesKeys: getKeys(`${iconActive}`),
          });
          formData.append(`${iconActive}`, file);
        }
      },
    );

    this.setState({
      files: formData,
    });
    return false;
  };

  handlerSaveClick = () => {
    const { dispatch } = this.props;
    const { files, filesKeys } = this.state;
    files.append('formNames', filesKeys.join(','));
    dispatch({
      type: `${namespace}/uploadFiles`,
      payload: files,
      callback: this.saveIcons,
    });
  };

  saveIcons = () => {
    const { [namespace]: { photoPath }, dispatch } = this.props;
    const arr = photoPath.split(',');
    const { filesKeys } = this.state;
    const res = [];
    filesKeys.map((item, i) => {
      res.push({
        iconId: filesKeys[i],
        iconImg: arr[i],
      });
    });
    dispatch({
      type: `${namespace}/saveIcons`,
      payload: {
        menuIcon: JSON.stringify(res),
      },
    });
  };

  render() {
    const { homeIconActive, openningIcon, endIcon, mineIcon, loading } = this.state;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const renderUpload = () => {
      return uploadArr.map(item => {
        const { name, icon, iconActive } = item;
        return (
          <div>
            <Divider orientation="left">{name}</Divider>
            <div className={styles.uploadbox}>
              <Upload
                listType="picture-card"
                className={styles.upload}
                showUploadList={false}
                beforeUpload={(file) => this.beforeUpload(file, item, true)}
              >
                {this.state[icon] ? <img src={this.state[icon]} alt="avatar" style={{ width: '100%' }}/> : uploadButton}
              </Upload>
              <Upload
                listType="picture-card"
                className={styles.upload}
                showUploadList={false}
                beforeUpload={(file) => this.beforeUpload(file, item)}
              >
                {this.state[iconActive] ?
                  <img src={this.state[iconActive]} alt="avatar" style={{ width: '100%' }}/> : uploadButton}
              </Upload>
            </div>
          </div>
        );
      });
    };
    return (
      <PageHeaderWrapper>
        <GridContent>
          <Row gutter={24}>
            <Col lg={8} md={24}>
              <Card
                bordered={false}
              >
                <div className={styles.imgbox}>
                  <img src={device} alt=""/>
                  <div className={styles.btn}>
                    <img src={homeIconActive} alt=""/>
                    <img src={openningIcon} alt=""/>
                    <img src={endIcon} alt=""/>
                    <img src={mineIcon} alt=""/>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={16} md={24}>
              <Card title='设置'>
                <div className={styles.uploadcontainer}>
                  {renderUpload()}
                </div>
                <Row>
                  <Col>
                    <Button type="primary" onClick={this.showConfirm}>发布</Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default App;
