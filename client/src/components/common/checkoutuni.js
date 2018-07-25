import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as actions from "../../actions";
import { Button, Row, Col, Checkbox } from "antd";
const CheckboxGroup = Checkbox.Group;

class CheckBoxForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedWrongList : [],
            allList: [],
        }
    }

    componentDidMount() {       
        this.dataList(this.props.titleList, this.props.valueList);
             
    }

    componentWillReceiveProps(nextProcess) {
        console.log(nextProcess);
        
        if(this.props.titleList !== nextProcess.titleList) {
            this.dataList(nextProcess.titleList, nextProcess.valueList)
        }
        
        if(this.props.apiCheckedList !== nextProcess.apiCheckedList) {
            this.setState({checkedWrongList: nextProcess.apiCheckedList})
            if(nextProcess.apiCheckedList.length > 0) {
            } else {
            }
        }
    }

    dataList = (rawTitleList, rawValueList) => {
        var data = [];
        console.log("RAW => ", rawValueList);
        
        rawTitleList.map((uni, index) => {
            let cond = true;
            Object.keys(rawValueList).map((key) => {
                if(cond && uni.fieldName === key) {
                    data.push(
                        {
                            "title": uni.title,
                            "value": rawValueList[uni.fieldName]
                        }
                    )
                    cond = false;
                } 
            })
            if(rawValueList.majors[0]) {
                console.log("RAWMAJOR =>", rawValueList);
                
                Object.keys(rawValueList.majors[0]).map((key) => {
                    if(cond && uni.fieldName === key) {
                        data.push({"title" : uni.title, "value" : rawValueList.majors[0][key]});
                        cond = false;
                    }
                })
            }
            if(rawValueList.degree[0]){
                Object.keys(rawValueList.degree[0]).map((key) => {
                    if(cond && uni.fieldName === key) {
                        data.push({"title" : uni.title, "value" : rawValueList.degree[0][key]})
                        cond = false;
                    }
                }) 
            }
            if(cond) {
                data.push({
                    "title" : uni.title,
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
        } else {
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
            nextButtonDisable: false,
            previousButtonDisable: false,
            titleList: [],
            title: [],
        }
    }

    componentDidMount() {
        this.props.fetchUniLists();
        this.props.fetchValidateType("University");
    }

    componentWillReceiveProps(nextProcess) { 
        console.log(nextProcess);
        
        if(this.props.validateType !== nextProcess.validateType) {
            var titleList = [];
            nextProcess.validateType.University.map(unis => {
                titleList.push({
                    "fieldName": unis.column_name,
                    "title" : unis.column_full_name
                })
            })
            localStorage.setItem('titleList', JSON.stringify(titleList));
            this.setState({title: titleList})
        }
        
        if(this.props.uniProfile !== nextProcess.uniProfile) {
            const id = this.props.match.params.id;
            const collect = nextProcess.uniProfile;
            collect.map((profile, index) => {
                console.log(collect);
                
                if(profile.id !== id) {                    
                } else {
                    this.setState({
                        profile: profile, 
                        dataIndex: index, 
                        status_flag: profile.status_flag
                    })
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
            var collect = nextProcess.uniProfile;
            collect.map((profile, index) => {
                if(profile.id !== id) {
                } else {
                    this.setState({
                        profile: profile, 
                        dataIndex: index, 
                        status_flag: profile.status_flag
                    })
                    if(index === collect.length-1) {
                        this.setState({nextButtonDisable: true})
                    }
                    if(index === 0 ){
                        this.setState({previousButtonDisable: true})
                    }
                }
            })
            var titleList = JSON.parse(localStorage.getItem('titleList'))
            this.setState({title: titleList})
        }
        if(this.props.updatedStatusFlag !== nextProcess.updatedStatusFlag) {
            this.props.fetchUniLists();
        }
    }

    nextScreen = () => {        
        var index = this.state.dataIndex + 1;
        var dataList = this.props.uniProfile;
        if(index < dataList.length){
            this.props.history.push(`/checkuni/${dataList[index].id}`)
            this.setState({finalWrongCheckedItem: []})
            this.setState({previousButtonDisable : false})
        } else {
            this.setState({nextButtonDisable : true});
        }
    }

    previousScreen = () => {
        var index = this.state.dataIndex - 1;
        var dataList = this.props.uniProfile;
        if(index >= 0){
            this.props.history.push(`/checkuni/${dataList[index].id}`)
            this.setState({finalWrongCheckedItem: []})
            this.setState({nextButtonDisable : false});
        } else {
            this.setState({previousButtonDisable : true})
        }
    }

    backScreen = () => {
        this.props.history.push(`/home`)
    }



    setAllTitle = (titles) => {
        this.setState({titleList : titles})
    }

    render() {
        return(
            <div className="ms-container">
                <Row type="flex" justify="center">
                    <Col span={2} ></Col>
                    <Col span={13}>
                        {this.state.title.length !== 0 ?
                            <CheckBoxForm 
                                titleList = {this.state.title}
                                valueList = {this.state.profile}
                            /> 
                        : "" }
                    </Col>
                    <Col span={2} ></Col>
                </Row>
                <div className="ms-button-container">
                    <Row type="flex" justify="space-between">
                        <Button type="primary" icon="rollback" size='large' onClick={() => this.backScreen()}>Back </Button>
                        <Button type="primary" icon="left" size='large' disabled={this.state.previousButtonDisable} onClick={() => this.previousScreen()}>Previous</Button>
                        <Button type="primary" icon="right" size='large' disabled={this.state.nextButtonDisable} onClick={() => this.nextScreen()}>Next</Button>
                    </Row>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
      uniProfile: state.uniList,
      validateType: state.validatetype
    };
}
export default connect(mapStateToProps, actions)(CheckOut);
