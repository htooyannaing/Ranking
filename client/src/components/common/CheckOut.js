import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as actions from "../../actions";
import { Button, Row, Col, Checkbox, Modal } from "antd";
const CheckboxGroup = Checkbox.Group;

const CheckStatus = (props) => {
    let status = props.status_flag;
    if(status !== 0){
        if(status === 1) {
            return(
                <div className="ribbon-wrap">
                    <div className="ribbon">
                        <a>
                            Real Information
                        </a>
                    </div>
                </div>
            )
        } else if(status === 2) {
            return(
                <div className="ribbon-wrap">
                    <div className="ribbon">
                        <a>
                            Fake Information
                        </a>
                    </div>
                </div>
            )
        } else if(status === 3){
            return(
                <div className="ribbon-wrap">
                    <div className="ribbon">
                        <a>
                            Need Information
                        </a>
                    </div>
                </div>
            )
        } else {
            return(
                <div></div>
            )
        }
    }else {
        return(
            <div className="ribbon-wrap">
                <div className="ribbon">
                    <a>
                        Check Information
                    </a>
                </div>
            </div>
        );
    }
}

class CheckBoxForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedWrongList : [],
            allList: [],
        }
    }

    componentDidMount() {
        this.props.buttonChange(false);   
        console.log(this.props.valueList);
             
        this.dataList(this.props.titleList, this.props.valueList);        
    }

    componentWillReceiveProps(nextProcess) {
        if(this.props.titleList !== nextProcess.titleList) {
            this.dataList(nextProcess.titleList, nextProcess.valueList)
        }
        
        if(this.props.apiCheckedList !== nextProcess.apiCheckedList) {
            this.setState({checkedWrongList: nextProcess.apiCheckedList})
            if(nextProcess.apiCheckedList.length > 0) {
                this.props.buttonChange(true)
                this.props.fakeAndNeedBtnChange(false)
            } else {
                this.props.buttonChange(false)
                this.props.fakeAndNeedBtnChange(true)
            }
        }
    }

    changeStr = (str) => {
        var sstr = str.toLowerCase();
        var result = sstr.replace(/[^a-z0-9]/gi,'');
        return result;
    }

    dataList = (rawTitleList, rawValueList) => {
        var data = [];
        rawTitleList.map((users, index) => {
            let cond = true;
            Object.keys(rawValueList).map((key) => {
                if(cond && users.fieldName === key) {
                    data.push(
                        {
                            "title": users.title,
                            "value": rawValueList[users.fieldName]
                        }
                    )
                    cond = false;
                } 
            })
            if(rawValueList.personal) {
                Object.keys(rawValueList.personal).map((key) => {
                    if(cond && users.fieldName === key) {
                        data.push({"title" : users.title, "value" : rawValueList.personal[key]});
                        cond = false;
                    }
                })
            }
            if(rawValueList.academic_histories){
                Object.keys(rawValueList.academic_histories).map((key) => {
                    if(cond && users.fieldName === key) {
                        data.push({"title" : users.title, "value" : rawValueList.academic_histories[key]})
                        cond = false;
                    }
                }) 
            }
            if(cond) {
                data.push({
                    "title" : users.title,
                    "value" : ""
                })
                cond = false;
            }
        })
        
        this.setState({allList: data})
    }

    onChange = async (checkedValues) => {
        this.setState({checkedWrongList: checkedValues})
        this.props.finalWrongCheckedList(checkedValues);
        
        if(checkedValues.length > 0) {
            this.props.buttonChange(true)
            this.props.fakeAndNeedBtnChange(false)
        } else {
            this.props.buttonChange(false)
            this.props.fakeAndNeedBtnChange(true)
        }
    }

    render() {
        var checkList = [];
        this.state.allList.map(tempList => {
            checkList.push(
                <Col span={24} className="user-detail" key={tempList.title}>
                    <Col span={12}>
                        <Checkbox key={tempList.title} value={tempList.title} checked={true} className="ms-checkbox"> 
                            {tempList.title} 
                        </Checkbox>
                    </Col>
                    <Col span={12}>
                        {tempList.value}
                    </Col>
                </Col>
            )
        });
        return <CheckboxGroup onChange={this.onChange} value={this.state.checkedWrongList} className="cb-group user-detail"><Row>{checkList}</Row></CheckboxGroup>
    }
}

class CheckOut extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            profile: {},
            dataIndex: null,
            status_flag: null,
            finalWrongCheckedItem: [],
            realButtonOption: false,
            nextButtonDisable: false,
            previousButtonDisable: false,
            titleList: [],
            title: [],
            fakeOrNeedBtnOption : false,
            profile_img: "",
            modalVisible: false,
        }
    }

    componentDidMount() {
        this.props.fetchUserLists();
        this.props.fetchValidateType("User");
    }

    componentWillReceiveProps(nextProcess) { 
        console.log(nextProcess);
        
        if(this.props.validateType !== nextProcess.validateType) {
            var titleList = [];
            nextProcess.validateType.User ? 
            nextProcess.validateType.User.map(users => {
                titleList.push({
                    "fieldName": users.column_name,
                    "title" : users.column_full_name
                })
            }) : 
            nextProcess.validateType.University.map(unis => {
                titleList.push({
                    "fieldName": unis.column_name,
                    "title" : unis.column_full_name
                })
            })
            localStorage.setItem('titleList', JSON.stringify(titleList));
            this.setState({title: titleList})
        }
        
        if(this.props.userProfile !== nextProcess.userProfile) {
            console.log("??");
            
            const id = this.props.match.params.id;
            const collect = nextProcess.userProfile;
            collect.map((profile, index) => {
                console.log(profile);
                
                if(profile.id !== id) {    
                    console.log(profile.id, "=", id);
                                    
                } else {
                    this.setState({
                        profile: profile, 
                        dataIndex: index, 
                        status_flag: profile.personal.status_flag
                    })
                    this.props.getWrongUserInfos(profile.id);
                    this.props.getProfileImg(profile.personal.profile_img);
                    if(index === collect.length-1) {
                        this.setState({nextButtonDisable: true})
                    }
                    if(index === 0 ){
                        this.setState({previousButtonDisable: true})
                    }
                }
            })
        }

        if(this.props.match.params.id !== nextProcess.match.params.id) {
            var id = nextProcess.match.params.id;
            var collect = nextProcess.userProfile;
            collect.map((profile, index) => {
                if(profile.id !== id) {
                } else {
                    this.setState({
                        profile: profile, 
                        dataIndex: index, 
                        status_flag: profile.personal.status_flag
                    })
                    if(index === collect.length-1) {
                        this.setState({nextButtonDisable: true})
                    }
                    if(index === 0 ){
                        this.setState({previousButtonDisable: true})
                    }
                    this.props.getWrongUserInfos(profile.id);
                    this.props.getProfileImg(profile.personal.profile_img);
                }
            })
            var titleList = JSON.parse(localStorage.getItem('titleList'))
            this.setState({title: titleList})
        }
        if(this.props.updatedStatusFlag !== nextProcess.updatedStatusFlag) {
            this.props.fetchUserLists();
        }
    }

    nextScreen = () => {        
        var index = this.state.dataIndex + 1;
        var dataList = this.props.userProfile;
        if(index < dataList.length){
            this.props.history.push(`/check/${dataList[index].id}`)
            this.setState({finalWrongCheckedItem: []})
            this.setState({previousButtonDisable : false})
        } else {
            this.setState({nextButtonDisable : true});
        }
    }

    previousScreen = () => {
        var index = this.state.dataIndex - 1;
        var dataList = this.props.userProfile;
        if(index >= 0){
            this.props.history.push(`/check/${dataList[index].id}`)
            this.setState({finalWrongCheckedItem: []})
            this.setState({nextButtonDisable : false});
        } else {
            this.setState({previousButtonDisable : true})
        }
    }

    backScreen = () => {
        this.props.history.push(`/home`)
    }

    checkedWrongItem = (finalWrongCheckedItem) => {
        this.setState({finalWrongCheckedItem})
    }

    /**
     * Real Button Disable or not
     */
    disableRealButton = (tOrF) => {
        this.setState({realButtonOption: tOrF})
    }

    disableFakeAndNeedButton = (tOrF) => {
        this.setState({fakeOrNeedBtnOption : tOrF});
    }

    /**
     * 1. Set status_flag both state and db Real Or Fake Or Need 
     * 2. Set Fake Or Need checked value in db || Set Real
     */
    optionChange = async (status) => {
        await this.setState({status_flag: status});
        await this.props.uploadPersonalStatusFlag(this.state.profile.id, status);
        if((status === 2 || status === 3) && (this.state.finalWrongCheckedItem.length === 0)) {
            if ( this.state.profile.academic_histories.wrong_infos.length > 0 ) {
            }else {
                await this.props.updateWrongUserInfo(this.state.profile.id, this.state.titleList);
            }
        } else {
            await this.props.updateWrongUserInfo(this.state.profile.id, this.state.finalWrongCheckedItem);
        }
    }

    setAllTitle = (titles) => {
        this.setState({titleList : titles})
    }

    setModal1Visible(modalVisible) {
        this.setState({ modalVisible });
    }

    render() {
        let data;
        this.props.profileImg ? 
           data = "data:image/png;base64," + this.props.profileImg
        : ""
        
        return(
            <div className="ms-container">
                <Row type="flex" justify="center">
                    <Col span={2} ></Col>
                    <Col span={6} className="text-center">
                        <span className="img-background">
                            <CheckStatus
                                status_flag = {this.state.status_flag}
                            />
                            {data !== undefined ?
                                <img src={data} alt="profile.png" onClick={() => this.setModal1Visible(true)}/> 
                            : ""
                            }
                        </span>
                    </Col>
                    <Col span={1} ></Col>
                    <Col span={13}>
                        <Modal
                            title="Preview"
                            style={{ top: 100 }}
                            visible={this.state.modalVisible}
                            onCancel={() => this.setModal1Visible(false)}
                            width
                            footer={[<Button key="back" type="primary" onClick={() => this.setModal1Visible(false)}>Return</Button>]}
                        >
                            {data !== undefined ?
                                <img className="modal-img" src={data} alt="profile.png"/> 
                            : ""
                            }
                        </Modal>
                        {this.state.title.length !== 0 ?
                            <CheckBoxForm 
                                titleList = {this.state.title}
                                valueList = {this.state.profile}
                                finalWrongCheckedList = {this.checkedWrongItem}
                                buttonChange = {this.disableRealButton}
                                apiCheckedList = {this.props.wrongDataFromApi}
                                allValue = {this.setAllTitle}
                                fakeAndNeedBtnChange = {this.disableFakeAndNeedButton}
                            /> 
                        : "" }
                    </Col>
                    <Col span={2} ></Col>
                </Row>
                <div className="ms-button-container">
                    <Row type="flex" justify="space-between">
                        <Button type="primary" icon="rollback" size='large' onClick={() => this.backScreen()}>Back </Button>
                        <Button type="primary" icon="left" size='large' disabled={this.state.previousButtonDisable} onClick={() => this.previousScreen()}>Previous</Button>
                        <Button type="primary" icon="close" disabled={this.state.fakeOrNeedBtnOption} size='large' onClick={() => this.optionChange(2)}>Fake</Button>
                        <Button type="primary" icon="check" disabled={this.state.realButtonOption} size='large' onClick={() => this.optionChange(1)}>Real</Button>
                        <Button type="primary" icon="exclamation" disabled={this.state.fakeOrNeedBtnOption} size='large' onClick={() => this.optionChange(3)}>Need</Button>
                        <Button type="primary" icon="right" size='large' disabled={this.state.nextButtonDisable} onClick={() => this.nextScreen()}>Next</Button>
                    </Row>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
      userProfile: state.allUserList,                          /** Get All User List */
      uniProfile: state.uniList,
      updatedStatusFlag : state.updateStatus,               /** Update Staus Flag (Real => 1, Fake => 2, Need => 3) */
      updateWrongUserInfo : state.updateWrongUserInfo,      /** Setting Checked Fake or Need Value to database */
      wrongDataFromApi : state.getWrongUserInfo,            /** Getting previous checked fake or need value */
      validateType: state.validatetype,
      profileImg: state.profile,
    };
}
export default connect(mapStateToProps, actions)(CheckOut);
