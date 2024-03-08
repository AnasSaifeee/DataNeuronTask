import React, { useEffect, useState } from 'react';
import Resizable from '../lib/Resizable';
import ResizableBox from '../lib/ResizableBox';
import 'style-loader!css-loader!../css/styles.css';
import 'style-loader!css-loader!./example.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
const CustomResizeHandle = React.forwardRef((props, ref) => {
  
  const {handleAxis, ...restProps} = props;
  return (
    <div
      className={`custom-handle custom-handle-${handleAxis} custom-resize-handle-component`}
      ref={ref}
      {...restProps}
    ></div>
  );
});

const ExampleLayout = () => {
  const [loader,setLoader]=useState(false)
  const [loader2,setLoader2]=useState(false)
  const [loader3,setLoader3]=useState(false)
  const [loadingUsers, setLoadingUsers] = useState({});
  const [state, setState] = useState({
    width1: 200,
    height1: 200,
    width2: 200,
    height2: 200,
    width3:200,
    height3:200,
    absoluteWidth: 200,
    absoluteHeight: 200,
    absoluteLeft: 0,
    absoluteTop: 0,
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onFirstBoxResize = (event, {element, size, handle}) => {
    setState(prevState => ({ ...prevState, width1: size.width, height1: size.height }));
  };

  const onSecondBoxResize = (event, {element, size, handle}) => {
    setState(prevState => ({ ...prevState, width2: size.width, height2: size.height }));
  };
  const onThirdBoxResize = (event, {element, size, handle}) => {
    setState(prevState => ({ ...prevState, width3: size.width, height3: size.height }));
  };

  const [formData,setFormData]=useState({
    userName:'',
    userEmail:'',
    otherDetails:'',
  })

  const [userData,setUserData]=useState([])

  function handleFormChange(e)
  {
    const {name,value}=e.target;
    setFormData((prevstate)=>({
      ...prevstate,
      [name]:value
    }))
  }

  async function handleAddUser()
  {
    setLoader(true)
      const response = await axios.post('http://localhost:5000/adduser',formData)
      if(response.data)
      {
        setLoader(false)
        GetUsers()

      }
  }
  async function GetUsers(){
    const response = await axios.get('http://localhost:5000/getusers')
    setUserData(response.data)
  }
  const updateUser = (userEmail) => {
    const updatedUserData = userData.map(user => {
      if (user.userEmail === userEmail) {
        return { ...user, isEditing: true };
      }
      return user;
    });
    setUserData(updatedUserData);
  };
  const handleInputChange = (event, userEmail, field) => {
    // Handle changes in input fields and update corresponding user details
    const updatedUserData = userData.map(user => {
      if (user.userEmail === userEmail) {
        return { ...user, [field]: event.target.value };
      }
      return user;
    });
    setUserData(updatedUserData);
  };

  const saveUser = async (userEmail) => {
    try {
      setLoader2(true)
      const userToUpdate = userData.find(user => user.userEmail === userEmail);
  
      const updatedUser = {
        userName: userToUpdate.userName,
        userEmail: userToUpdate.userEmail,
        otherDetails: userToUpdate.otherDetails
      };
  
      const response = await axios.put(`http://localhost:5000/users/${userEmail}`, updatedUser);
  
      if (response.data) {
        const updatedUserData = userData.map(user => {
          if (user.userEmail === userEmail) {
            return { ...user, isEditing: false };
          }
          return user;
        });
        GetUsers()
        setLoader2(false)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const deleteUser = async (userEmail) => {
    try {
      setLoadingUsers(prevLoadingUsers => ({ ...prevLoadingUsers, [userEmail]: true }));
      setLoader3(true)
      const response = await axios.delete(`http://localhost:5000/users/${userEmail}`);
      
      if (response.data) {
        GetUsers()
        setLoader3(false)
      }
    } catch (error) {
      
      console.error('Error:', error);
      setLoader3(false)
    }finally {
      setLoadingUsers(prevLoadingUsers => ({ ...prevLoadingUsers, [userEmail]: false }));
    }
  };
  
  useEffect(()=>{
    GetUsers()
  },[])
  return (
    <div>
      <div className="layoutRoot">
        <Resizable className="box" height={state.height1} width={state.width1} onResize={onFirstBoxResize} resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}>
          <div style={{width: state.width1 + 'px', height: state.height1 + 'px'}}>
            Add User
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell>User Email</TableCell>
            <TableCell>Other Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
            <TableCell><TextField id="standard-basic" value={formData.userName} name='userName' onChange={handleFormChange} variant="standard" /></TableCell>
            <TableCell><TextField id="standard-basic" value={formData.userEmail} name='userEmail' onChange={handleFormChange}  variant="standard" /></TableCell>
            <TableCell><TextField id="standard-basic" value={formData.otherDetails} name='otherDetails' onChange={handleFormChange}  variant="standard" /></TableCell>
            </TableRow>
            
          </TableBody>
        </Table>
        <div style={{display:"flex",justifyContent:"flex-end",width:"100%"}} >
        <Button variant='contained' size='small' color='success' style={{margin:'20px',width:"100px"}} onClick={handleAddUser}>{loader?<CircularProgress color='inherit' size={30}/>:"Add User"}</Button>
        </div>
      </TableContainer>

     
    </Paper>
             </div>
        </Resizable>
        <Resizable className="box" height={state.height2} width={state.width2} onResize={onSecondBoxResize} resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}>
          <div style={{width: state.width2 + 'px', height: state.height2 + 'px'}}>
            Update User
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>User Name</TableCell>
                      <TableCell>User Email</TableCell>
                      <TableCell>Other Details</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userData.map(user => (
                      <TableRow key={user.userEmail}>
                        <TableCell>
                          {user.isEditing ? (
                            <TextField
                              value={user.userName}
                              variant='standard'
                              onChange={(event) => handleInputChange(event, user.userEmail, 'userName')}
                            />
                          ) : (
                            user.userName
                          )}
                        </TableCell>
                        <TableCell>
                          {user.isEditing ? (
                            <TextField
                              value={user.userEmail}
                              variant='standard'
                              onChange={(event) => handleInputChange(event, user.userEmail, 'userEmail')}
                            />
                          ) : (
                            user.userEmail
                          )}
                        </TableCell>
                        <TableCell>
                          {user.isEditing ? (
                            <TextField
                              value={user.otherDetails}
                              variant='standard'
                              onChange={(event) => handleInputChange(event, user.userEmail, 'otherDetails')}
                            />
                          ) : (
                            user.otherDetails
                          )}
                        </TableCell>
                        <TableCell>
                          {user.isEditing ? (
                            <Button variant='contained' size='small' onClick={() => saveUser(user.userEmail)}>{loader2?<CircularProgress color='inherit' size={30}/>:"Save"}</Button>
                          ) : (
                            <Button variant='contained' size='small' onClick={() => updateUser(user.userEmail)}>Edit</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
             </div>
        </Resizable>
        <Resizable className="box" height={state.height3} width={state.width3} onResize={onThirdBoxResize} resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}>
          <div style={{width: state.width3 + 'px', height: state.height3 + 'px'}}>
          Delete User
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell>User Email</TableCell>
            <TableCell>Other Details</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map(user => (
            <TableRow key={user.userEmail}>
              <TableCell>
                {user.userName}
              </TableCell>
              <TableCell>
                {user.userEmail}
              </TableCell>
              <TableCell>
                {user.otherDetails}
              </TableCell>
              <TableCell>
                <Button
                  variant='contained'
                  size='small'
                  color='error'
                  disabled={loadingUsers[user.userEmail]}
                  onClick={() => deleteUser(user.userEmail)}
                >
                  {loadingUsers[user.userEmail] ? <CircularProgress color='inherit' size={20} /> : 'Delete'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

     
    </Paper>
           
          </div>
        </Resizable>
      
      </div>
    </div>
  );
};

export default ExampleLayout;
