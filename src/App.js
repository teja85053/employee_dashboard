import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: ''
  });

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      
      // Transform API data to match our employee structure
      const transformedData = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.company.name,
        position: user.company.catchPhrase,
        salary: Math.floor(Math.random() * 50000) + 50000
      }));
      
      setEmployees(transformedData);
    } catch (err) {
      setError('Failed to fetch employees. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add employee via API
  const addEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
      
      const data = await response.json();
      
      // Add to local state with a temporary ID
      const employeeWithId = {
        ...newEmployee,
        id: employees.length + 1,
      };
      
      setEmployees([...employees, employeeWithId]);
      setNewEmployee({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        salary: ''
      });
      setShowAddForm(false);
      setError('');
    } catch (err) {
      setError('Failed to add employee. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update employee
  const updateEmployee = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editingEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingEmployee),
      });
      
      const data = await response.json();
      
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? editingEmployee : emp
      ));
      setEditingEmployee(null);
    } catch (err) {
      setError('Failed to update employee. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      });
      
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load employees on login
  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployees();
    }
  }, [isLoggedIn]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
    } else {
      setError('Please enter email and password');
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="login-icon">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1>Employee Portal</h1>
            <p>Sign in to manage employees</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                placeholder="admin@company.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Enter password"
              />
            </div>

            <button onClick={handleLogin} className="btn btn-primary btn-full">
              Sign In
            </button>
          </div>

          <p className="demo-note">Demo: Use any email and password</p>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1>Employee Dashboard</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="btn btn-danger">
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Total Employees</p>
                <p className="stat-value">{employees.length}</p>
              </div>
              <div className="stat-icon stat-icon-blue">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Departments</p>
                <p className="stat-value">{new Set(employees.map(e => e.department)).size}</p>
              </div>
              <div className="stat-icon stat-icon-green">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Avg Salary</p>
                <p className="stat-value">
                  ${employees.length > 0 ? Math.round(employees.reduce((a, b) => a + b.salary, 0) / employees.length).toLocaleString() : 0}
                </p>
              </div>
              <div className="stat-icon stat-icon-purple">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-header">
          <h2>Employee List</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Employee</span>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Add Employee Form */}
        {showAddForm && (
          <div className="form-card">
            <h3>Add New Employee</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Full Name *"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email *"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Department"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
              />
              <input
                type="text"
                placeholder="Position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
              />
              <input
                type="number"
                placeholder="Salary"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
              />
            </div>
            <div className="form-actions">
              <button onClick={addEmployee} disabled={loading} className="btn btn-success">
                {loading ? 'Adding...' : 'Add Employee'}
              </button>
              <button onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Employee Form */}
        {editingEmployee && (
          <div className="form-card">
            <h3>Edit Employee</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Full Name"
                value={editingEmployee.name}
                onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                value={editingEmployee.email}
                onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={editingEmployee.phone}
                onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Department"
                value={editingEmployee.department}
                onChange={(e) => setEditingEmployee({...editingEmployee, department: e.target.value})}
              />
              <input
                type="text"
                placeholder="Position"
                value={editingEmployee.position}
                onChange={(e) => setEditingEmployee({...editingEmployee, position: e.target.value})}
              />
              <input
                type="number"
                placeholder="Salary"
                value={editingEmployee.salary}
                onChange={(e) => setEditingEmployee({...editingEmployee, salary: e.target.value})}
              />
            </div>
            <div className="form-actions">
              <button onClick={updateEmployee} disabled={loading} className="btn btn-primary">
                {loading ? 'Updating...' : 'Update Employee'}
              </button>
              <button onClick={() => setEditingEmployee(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Employee Table */}
        <div className="table-card">
          {loading && employees.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading employees...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No employees found. Add your first employee!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="font-medium">{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>
                        <span className="badge">{employee.department}</span>
                      </td>
                      <td>{employee.position}</td>
                      <td className="font-medium">${employee.salary.toLocaleString()}</td>
                      <td>
                        <button onClick={() => setEditingEmployee(employee)} className="btn-link btn-link-primary">
                          Edit
                        </button>
                        <button onClick={() => deleteEmployee(employee.id)} className="btn-link btn-link-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;