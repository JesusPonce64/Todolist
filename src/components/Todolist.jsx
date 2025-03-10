import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, Form, Input, Popconfirm, Table, Checkbox, Row } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { getDatabase, ref, get, set, child, update, push } from 'firebase/database';
import firebaseProyecto from '../config/firebaseconfig';
import { useAuth } from '../hooks/useAuth'; 


const db = getDatabase(firebaseProyecto);

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingInlineEnd: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};


const getUserCredentialsByEmail = async (email) => {
  const usersRef = ref(db, 'users'); 
  try {
    const snapshot = await get(usersRef); 
    if (snapshot.exists()) {
      const users = snapshot.val(); 
      for (const userId in users) {
        if (users[userId].email === email) {
          const credentials = users[userId].credentials; 
          return credentials; 
        }
      }
      console.log('Usuario no encontrado con este email.');
      return null;
    } else {
      console.log('No hay datos disponibles.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los datos: ', error);
  }
};


const getFormattedDate = () => {
  const today = new Date();
  const showTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const fulldate = `${date}/${month}/${year}  ${showTime}`
  return fulldate;
};

const App = () => {
  const { logout, user } = useAuth(); 
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(2);
  const [userPermissions, setUserPermissions] = useState(null); 

  useEffect(() => {

    if (user && user.email) {
      getUserCredentialsByEmail(user.email).then((credentials) => {
        setUserPermissions(credentials); 
      });
    }
    
   
    const fetchData = async () => {
      const dataRef = ref(db, 'tasks'); 
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        const tasks = snapshot.val();
        const tasksArray = Object.keys(tasks).map((key) => ({
          key,
          ...tasks[key],
        }));
        setDataSource(tasksArray); 
        setCount(tasksArray.length + 1); 
      }
    };

    fetchData(); 
  }, [user]);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    console.log(`Tarea eliminada por: ${user?.email}`)
    const taskRef = ref(db, `tasks/${key}`);
    set(taskRef, null);
  };

  const defaultColumns = [
    {
      title: 'name',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'des',
      editable: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      editable: false,
    },
    {
      title: 'user',
      dataIndex: 'user',
      editable: false
    },
    {
      title: 'Check',
      dataIndex: 'check',
      editable: false,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const columnsread = [
    {
      title: 'name',
      dataIndex: 'name',
      editable: false,
    },
    {
      title: 'Description',
      dataIndex: 'des',
      editable: false,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      editable: false,
    },
    {
      title: 'user',
      dataIndex: 'user',
      editable: false
    },
    {
      title: 'Check',
      dataIndex: 'check',
      editable: false,
    },
  ]

  const handleAdd = () => {
    const newData = {
      key: count,
      name: `New task`,
      des: 'click to edit',
      date: getFormattedDate(), 
      check: <Checkbox />,
      user: user?.email,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);

    const newTaskRef = push(ref(db, 'tasks'));
    set(newTaskRef, newData);

    setDataSource([...dataSource, {...newData, key: newTaskRef.key}])
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);

    // Guardar los cambios en Firebase
    const taskRef = ref(db, `tasks/${row.key}`);
    update(taskRef, row);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  if (userPermissions === "read"){
   return (
    <div>
        <Row>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columnsread}
          pagination={false}
      ></Table>
      </Row>
      <Row>
      <LogoutOutlined onClick={logout} />
      </Row>
      </div>
      ) 
  }
  return (
    <div>
      {userPermissions === 'write' && (
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
      )}

      <Row>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </Row>
      <Row>
        <LogoutOutlined onClick={logout} />
      </Row>
    </div>
  );
};

export default App;




