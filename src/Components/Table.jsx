import React from 'react'
import  { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Toolbar, Typography, TextField, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';


const TableComponent = ({data}) => {
    const [rows, setRows] = useState(data);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filter, setFilter] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
  
    // Form state to handle new and updated user data
    const [userForm, setUserForm] = useState({
      id: uuidv4(),
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      age:'',
      country: '',
      phone: ''
    });
   // Extract column headers dynamically based on the keys of the first data object
   const columns = Object.keys(data[0] || {});


 // Handle sorting dynamically
 const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

 // Filter rows based on the search filter
  const filteredRows = rows.filter(row => {
    return columns.some(key => row[key]?.toString().toLowerCase().includes(filter.toLowerCase()));
  });

   // Sorting rows dynamically
  const sortedRows = useMemo(() => {
    return filteredRows.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, order, orderBy]);

   // Pagination
  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = ( event,newPage) => {
    event.preventDefault();
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

   const handleEdit = (id) => {
    const user = rows.find((row) => row.id === id);
    const formattedDob = user.dob ? format(new Date(user.dob), 'yyyy-MM-dd') : '';
    setUserForm({...user,
        dob:formattedDob});
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUserForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (isEditing) {
      // Update the existing row
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === userForm.id ? userForm : row))
      );
    } else {
      // Add a new row
      setRows((prevRows) => [...prevRows, { ...userForm, id: uuidv4() }]);
    }
    setOpenDialog(false);
    setIsEditing(false);
    setUserForm({
      id: uuidv4(),
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      age:'',
      country: '',
      phone: ''
    });
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    setUserForm({
      id: uuidv4(),
      firstName: '',
      lastName: '',
      email: '',
      dob:'',
      age:'',
      country: '',
      phone: ''
    });
    setOpenDialog(true);
  };

  // Function to format date
const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), "dd-MM-yyyy");
    } catch (e) {
      console.error("Invalid date format:", dateStr);
      return dateStr; // Return the original string if there's an error
    }
  };


  return (
    <Box>
      <Paper>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{color:'grey', fontWeight:'bold',fontFamily: 'Monospace' }}
            style={{ marginLeft: "400px", fontSize:'30px', }}
          >
            React Table MUI
          </Typography>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={filter}
            onChange={handleFilterChange}
            style={{ marginLeft: "auto" }}
          />
          <Button
            onClick={handleAddNewClick}
            variant="contained"
            style={{ marginLeft: "10px" }}
          >
            Add New
          </Button>
        </Toolbar>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    onClick={() => handleRequestSort(col)}
                    style={{ cursor: "pointer" }}
                    sx={{fontFamily:'monospace',fontWeight:'600',fontSize:'17px'}}
                  >
                    {col.charAt(0).toUpperCase() +
                      col.slice(1).replace(/_/g, " ")}{" "}
                    {/* Capitalize headers */}
                    {orderBy === col ? (order === "asc" ? " 🔼" : " 🔽") : ""}
                  </TableCell>
                ))}
                <TableCell sx={{fontFamily:'monospace',fontWeight:'600',fontSize:'17px'}}>Actions</TableCell>{" "}
                {/* Actions column for edit/delete */}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col} sx={{fontFamily:'sans-serif',fontWeight:'500',fontSize:'15px'}}>
                      {" "}
                      {col === "dob" ? formatDate(row[col]) : row[col]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton color='primary' onClick={() => handleEdit(row.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton color='error' onClick={() => handleDelete(row.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="Box"
          count={sortedRows.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              name="firstName"
              value={userForm.firstName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={userForm.lastName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={userForm.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="dob"
              type="date"
              value={userForm.dob || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Age"
              name="age"
              value={userForm.age}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            {/* <DatePicker
            selected={date}
            onSelect={handleDateSelect} //when day is clicked
            onChange={handleDateChange} //only when value has changed
        /> */}

            <TextField
              label="Country"
              name="country"
              value={userForm.country}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone"
              value={userForm.phone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              color="primary"
            >
              {isEditing ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default TableComponent
