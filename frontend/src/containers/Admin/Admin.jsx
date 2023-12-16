import { Button, Modal, Form, Input, Typography, InputNumber, Popconfirm, FloatButton } from "antd";
import { Table} from 'antd';

import './Admin.css';
import { useEffect } from "react";
import {connect} from 'react-redux'
import { useNavigate } from "react-router";

import {retrieveData, createCategory, deleteCategory, EditSubCategoryById} from '../../actions/admin';
import { logout } from "../../actions/auth";
import { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";


{/*=========================================================== */}
{/*============Table Body for SubCategory Creation in New Category Creation ============== */}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


const Admin  = (props) => {

  {/*=========================================================== */}
  {/*Get Category Datas from database */}
  useEffect(() => {
    props.retrieveData()
  },[]);

  const navigate = useNavigate();


  {/*======================================Category Create & Delete ======================================================*/}
  {/*================== Open Create New Category Modal ========================= */}
  const [isAddNewCategoryModalOpen, setIsAddNewCategoryModalOpen] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputUnit, setInputUnit] = useState("");

  const handleAddNewCategory = () => {
    setIsAddNewCategoryModalOpen(true);
  }

  const handleCreateNewCategory = () => {
    const tempObj = {
      name: inputName,
      unit: inputUnit,
      subCategory: data
    };
    props.createCategory(tempObj);
    setInputName("");
    setInputUnit("");
    setData([]);
    setIsAddNewCategoryModalOpen(false);
  }

  const handleCancelCreateNewCategoryModal = () => {
    setInputName("");
    setInputUnit("");
    setData([]);
    setIsAddNewCategoryModalOpen(false);
  }

  const handleChangeCategoryName = (e) => {
    setInputName(e.target.value);
  }

  const handleChangeCategoryUnit = (e) => {
    setInputUnit(e.target.value);
  }

  const handleDeleteSubCategoryInCreateCategory = (row) => {
    console.log('row = ', row);
    const {item} = row;
    const updatedData = data.filter(value => value.item !== item);
    setData(updatedData);
  }

  {/*================== Delete Category ========================= */}

  const handleDeleteCategory = (row) => {
    const {id} = row;
    props.deleteCategory(id);
  }


  {/*=============== Show & Edit SubCategory from Category ============================ */}
  const [isSetEditSubCategoryModalOpen, setIsSetEditSubCategoryModalOpen] = useState(false);
  const [subCategoryByCategoryName, setSubCategoryByCategoryName] = useState([]);
  const [categoryIdToEdit, setCategoryIdToEdit] = useState("");

  const handleSubCategory = (row) => {
    const {id, name} = row;
    const item = props.data.find(item => item.name === name);
    setCategoryIdToEdit(id);

    if (item) {
      const data = JSON.parse(item.subcategory);
      const updatedData = data && data.map((element, index) => ({
        ...element,
        key: index,
      }));
      setSubCategoryByCategoryName(updatedData);

    } else {
      console.log('Subcategory not found');
      return "";
    }
    setIsSetEditSubCategoryModalOpen(true);
  }

  const handleEditSubCategory = () => {
    props.EditSubCategoryById(categoryIdToEdit, subCategoryByCategoryName );
    setIsSetEditSubCategoryModalOpen(false);
  }

  const handleCancelEditSubCategoryModal = () => {
    setIsSetEditSubCategoryModalOpen(false);
  }

  {/*================================================ */}
  {/*===========Edit SubCategory Column */}

  const [subCategoryform] = Form.useForm();
  const [editingSubCategorykey, setEditingSubCategorykey] = useState('');
  const isEditingSubCategory = (record) => record.key === editingSubCategorykey;
  const editSubCategory = (record) => {
    subCategoryform.setFieldsValue({
      item: '',
      price: '',
      wastage: '',
      ...record,
    });
    setEditingSubCategorykey(record.key);
  };

  const cancelEditSubCategory = () => {
    setEditingSubCategorykey('');
  };

  const saveEditSubCategory = async (key) => {
    try {
      const row = await subCategoryform.validateFields();
      const newData = [...subCategoryByCategoryName];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setSubCategoryByCategoryName(newData);
        setEditingSubCategorykey('');
      } else {
        newData.push(row);
        setSubCategoryByCategoryName(newData);
        setEditingSubCategorykey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const SubCategory_columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      width: '30%',
      editable: true,
    },
    {
      title: 'Price($)',
      dataIndex: 'price',
      width: '10%',
      editable: true,
    },
    {
      title: 'Wastage(%)',
      dataIndex: 'wastage',
      width: '10%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width:'20%',
      render: (_, record) => {
        const editable = isEditingSubCategory(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => saveEditSubCategory(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancelEditSubCategory}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingSubCategorykey !== ''} onClick={() => editSubCategory(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      width:"30%",
      render: (_, row) => (
        <Button danger type="primary" onClick={() => handleDeleteSubCategoryInCategory(row)}>
          Delete
        </Button>
      ),
    },
  ];

  const edit_SubCategory_columns = SubCategory_columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'item' ? 'text' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingSubCategory(record),
      }),
    };
  });

  const handleAddmoreSubCategoryButton = () => {
    let newkey = subCategoryByCategoryName.length;
    const newData = [...subCategoryByCategoryName];
    const row = {
      key: newkey,
      item: "",
      price:0,
      wastage:0,
    }
    newData.push(row);
    setSubCategoryByCategoryName(newData);
    setEditingSubCategorykey(newkey);
  }

  const handleDeleteSubCategoryInCategory = (row) => {
    const {item} = row;
    const updatedsubCategory = subCategoryByCategoryName.filter(value => value.item !== item);
    setSubCategoryByCategoryName(updatedsubCategory);
  }


  {/*=========================================================================== */}
  {/*=============Create New Catetory Column================= */}
  const Category_columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Unit of Measure',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'SubCategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
      render: (_, row) => (
        <Button type="primary" onClick={() => handleSubCategory(row)}>Show & Edit</Button>
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      render: (_, row) => (
        <Button danger type="primary" onClick={() => handleDeleteCategory(row)}>Delete</Button>
      )
    }
  ];

  

  {/*======================================================================= */}
  {/*=========Create, Edit, SubCategory in Create New Category Modal */}

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      item: '',
      price: '',
      wastage: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      width: '20%',
      editable: true,
    },
    {
      title: 'Price($)',
      dataIndex: 'price',
      width: '15%',
      editable: true,
    },
    {
      title: 'Wastage(%)',
      dataIndex: 'wastage',
      width: '15%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width:'40%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      render:(_, row) => (
        <Button danger type="primary" onClick={() => handleDeleteSubCategoryInCreateCategory(row)}>Delete</Button>
      )
    }
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'item' ? 'text' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleAddmoreButton = () => {
    let newkey = data.length;
    const newData = [...data];
    const row = {
      key: newkey,
      item: "",
      price:0,
      wastage:0,
    }
    newData.push(row);
    setData(newData);
    setEditingKey(newkey);
  }
  

  return (
    <div>
      <FloatButton
        icon={<LogoutOutlined />}
        type="primary"
        style={{
          right: "10%",
        }}
        onClick={() => {
          props.logout();
          navigate('/signin', {replace:true})
        }}
        tooltip="Log out"
      />
      <div className="add_btn">
        <Button type="primary" onClick={handleAddNewCategory}>Add new Category</Button>
      </div>
      <div className="category_show">
        <Table columns={Category_columns} dataSource={props.data} />
      </div>

      <Modal
        open = {isSetEditSubCategoryModalOpen}
        onOk={handleEditSubCategory}
        onCancel={handleCancelEditSubCategoryModal}
        width={"50vw"}
      >
        <div>
          <Typography.Title level={5}>Edit SubCategory</Typography.Title>
          <Form form={subCategoryform} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={subCategoryByCategoryName}
              columns={edit_SubCategory_columns}
              rowClassName="editable-row"
              pagination={false}
            />
            <Button type="link" onClick={handleAddmoreSubCategoryButton}> + Add more</Button>
          </Form>
        </div>
      </Modal>
          
      <Modal
        title = "Add New Category"
        open = {isAddNewCategoryModalOpen}
        onOk={handleCreateNewCategory}
        onCancel={handleCancelCreateNewCategoryModal}
        width="50vw"
      >
        <div>
          <Typography.Title level={5}>Category Items</Typography.Title>
          <Input
            type="text"
            name="name"
            onChange={handleChangeCategoryName}
            value={inputName}
          />
        </div>
        <div>
          <Typography.Title level={5}>Type Of measure</Typography.Title>
          <Input
            type="text"
            name="unit"
            onChange={handleChangeCategoryUnit}
            value={inputUnit}
          />
        </div>
        <div>
          <Typography.Title level={5}>SubCategory</Typography.Title>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={data}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={false}
            />
            <Button type="link" onClick={handleAddmoreButton}> + Add more</Button>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => ({
  data: state.admin.data,
})

export default connect(mapStateToProps, {retrieveData, createCategory, deleteCategory, EditSubCategoryById, logout})(Admin)


