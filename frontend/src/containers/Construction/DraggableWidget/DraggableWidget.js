import { Input, Button, notification, Select, Table, Dropdown, Menu } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import { useEffect } from "react";
import {connect, useSelector} from 'react-redux';
import { useState } from "react";
import Draggable from "react-draggable";
import { exportToExcel } from 'react-json-to-excel';

import {saveResult} from '../../../actions/result';


const DraggableWidget = (props) =>  {
  const [data, setData]  =useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isSaveDatabaseConfirmModal, setIsSaveDatabaseConfirmModal] = useState(false);
  const [previousmeasure, setPreviousMeasure] = useState(0);
  const [height, setHeight] = useState(1);
  const [depth, setDepth] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [showAllData, setShowAllData] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: 'Success',
      description:
        'You have successfully saved measure data to the database.',
      icon: (
        <SmileOutlined
          style={{
            color: '#108ee9',
          }}
        />
      ),
    });
  };

  useEffect(() => {
    let temp = props.widgetData.slice(1).map((item, index) => {
      return {key: index, ...item}
    })
    console.log('temp: ', temp);
    temp.projectName = props.projectName;
    setData(temp)
  },[props.widgetData])

  useEffect(() => {
    if(props.data === "OK"){
      openNotification()
    }
  },[props.data])
  
  const handleDimension = (index) => {
    console.log(index);
    const selectedRow = data[index];
    setSelectedIndex(index);
    setSelectedData(selectedRow);
    setPreviousMeasure(selectedRow && selectedRow.measure);
    setIsOpenModal(true);
  };

  const onOK = () => {
    const newData = [...data];
    newData[selectedIndex] = selectedData;
    setData(newData);
    setIsOpenModal(false);
  }

  const onCancel = () => {
    setIsOpenModal(false);
  }


  const onDepthChange = (e) => {
    if(e.target.value)
      {setDepth(e.target.value);}
    else {setDepth(1);}

    setSelectedData({
      ...selectedData,
      result: previousmeasure * height * (e.target.value ? e.target.value : 1) *(1 + pitch / 100)
    })
    selectedData.result = selectedData.result
  }

  const onHeightChange = (e) => {
    if(e.target.value)
      setHeight(e.target.value);
    else
      setHeight(1);
    setSelectedData({
      ...selectedData,
      result:previousmeasure * depth * (e.target.value ? e.target.value : 1) * (1 + pitch / 100)
    })
  }

  const onPitchChange = (e) => {
    if(e.target.value) setPitch(e.target.value);
    else setPitch(0);
    setSelectedData({
      ...selectedData,
      result:previousmeasure * depth * height * (1 + e.target.value / 100)
    })
  }

  const saveDatabase = () => {
    setIsSaveDatabaseConfirmModal(true);
  }

  const handleSaveData = () => {
    props.saveResult(data);
    setIsSaveDatabaseConfirmModal(false);
  }

  const handleSaveCancel = () => {
    setIsSaveDatabaseConfirmModal(false);
  }

  const ExportExcel = () => {

    const transformedData = [];

    console.log('testData = ', data);

    for(var i = 0; i< data.length; i++) {
      for(var j = 0; j < data[i].subcategory.length; j++) {
        let temp = {
          area: data[i].area,
          subarea: data[i].subarea,
          category: data[i].category,
          subcategory: data[i].subcategory[j],
          type: data[i].type,
          measure: data[i].measure,
          unit: data[i].unit,
          price: data[i].price[j]
        }
        transformedData.push(temp);
        console.log("trans = ", transformedData);
      }
    }

    exportToExcel(transformedData, 'measure');
  }

  const widgetdata_columns = [
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: 'SubArea',
      dataIndex: 'subarea',
      key: 'subarea',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: 'SubCategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
      render: (subcategory, record) => (
        <Select
          onChange={handleSubCategorySelect}
          defaultValue={subcategory[0]}
        >
          {subcategory.map((option, index) => (
              <Option key={index} value={option}>
              {option}
              </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit'
    },
    {
      title: 'Measure',
      dataIndex: 'measure',
      key: 'measure'
    },
    {
      title: 'HDP',
      dataIndex: 'hdp',
      key: 'hdp',
      render:(_, row) => (
        // <div style={{cursor: "pointer"}} onClick={() => props.onClick(row)}>HDP</div>
        <div style={{cursor: "pointer"}} onClick={() => handleDimension(row.key)}>HDP</div>
      )
    },
    {
      title:'Result',
      dataIndex: 'result',
      key: 'result'
    },
    {
      title: 'Price($)',
      dataIndex: 'price',
      key: 'price',
      render:(price, record) => (
        price[selectedIndex]
      )
    },
    {
      title: 'Option',
      dataIndex: 'option',
      key: 'option',
      render: (record, row) => (
          <Button danger type="primary" onClick={() => {props.onDelete(row.id); }}>Delete</Button>
      )
    }
    
  ];

  const { Option } = Select;
  const handleSubCategorySelect = (value, option) => {
      setSelectedIndex(option.key);
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    let selectedID = newSelectedRowKeys.map(index => (
      data[index].id
    ))
    props.selectData(selectedID);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const dataSource = showAllData ? data : data.slice(-1);
  const handleDropdownMenuClick = (e) => {
    if(e.key === "showAll") setShowAllData(true);
    else setShowAllData(false);
  };

  const dropdownMenu = (
    <Menu onClick={handleDropdownMenuClick}>
      <Menu.Item key="showAll">Show All Data</Menu.Item>
      <Menu.Item key="showLast">Show Only Last Data</Menu.Item>
    </Menu>
  );

  

    return (
    <>
        {contextHolder}
        <Draggable>
          <div className="draggableWidget">
          <Dropdown overlay={dropdownMenu} trigger={['click']}>
            <Button>Show Data</Button>
          </Dropdown>
            <Table 
              rowSelection={rowSelection} 
              columns={widgetdata_columns} 
              dataSource={dataSource} 
              pagination={false} 
            /> 
            <div className="widget-footer">
              <Button type="primary" onClick={ExportExcel}>Export to Excel</Button>
              <Button type="primary" onClick={saveDatabase}>Save Database</Button>
            </div>
          </div>
        </Draggable>

            <Modal
              title = "Add Dimension"
              open = {isOpenModal}
              onOk = {onOK}
              onCancel={onCancel}
            >
              {
                selectedData && (
                  <div>
                    <div className="row">
                      <div className="col-md-2 p-0">{selectedData.area}</div>
                      <div className="col-md-3 p-0">{selectedData.subarea}</div>
                      <div className="col-md-2 p-0">{selectedData.category}</div>
                      <div className="col-md-2 p-0">{selectedData.type}</div>
                      <div className="col-md-3 p-0">{selectedData.measure}</div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-md-4 p-0">
                        <label>Height/Width(m)</label>
                        <Input 
                          type="number" 
                          name = "height" 
                          onChange={onHeightChange}
                          placeholder = {0}
                        />
                      </div>
                      <div className="col-md-4 p-0">
                        <label>Depth(m)</label>
                        <Input 
                          type="number" 
                          name = "depth" 
                          placeholder = {0}
                          onChange={onDepthChange}
                        />
                      </div>
                      <div className="col-md-4 p-0">
                        <label>Pitch(%)</label>
                        <Input 
                          type="number" 
                          name = "pitch" 
                          placeholder = {0}
                          onChange={onPitchChange}
                        />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-md-4">Total</div>
                      <div className="col-md-4"></div>
                      <div className="col-md-4">{selectedData.result}</div>
                    </div>
                  </div>
                )
              }
              
            </Modal>
            <Modal title="Basic Modal" open={isSaveDatabaseConfirmModal} onOk={handleSaveData} onCancel={handleSaveCancel}>
              <p>Are you really going to save Drawing Data to Database?</p>
            </Modal>

      </>

    )
}

const mapStateToProps = (state) => ({
  data: state.result.data
})

export default connect(mapStateToProps, {saveResult})(DraggableWidget) ;