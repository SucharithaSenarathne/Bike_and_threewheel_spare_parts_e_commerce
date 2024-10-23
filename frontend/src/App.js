import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import LoginRegister from './pages/LoginRegister';
import AdminDashboard from './pages/AdminDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AddItem from './pages/AddItem';
import ItemList from './components/ItemList';
import ItemDetail from './pages/ItemDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminOrderList from './components/AdminOrderList';  
import AdminOrderDetail from './components/AdminOrderDetail';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetails';
import ItemReview from './pages/ItemReview';
import StripeProvider from './context/StripeProvider'
import Inventory from './components/Inventory';
import Settings from './pages/Settings';
import RequestPasswordReset from './components/RequestPasswordReset';
import ResetPassword from './components/ResetPassword';
import UserManagement from './pages/UserManagement';
import AdminRoute from './utils/AdminRoute';

function App() {
    return (
      <StripeProvider>
      <Router>
        <AuthProvider>
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/loginregister" element={<LoginRegister />} />
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/buyer/dashboard" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
                <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
                <Route path="/items/all" element={<ItemList />} />
                <Route path="/items/:category/:subcategory" element={<ItemList />} />
                <Route path="/item/:id" element={<ItemDetail/>} />
                <Route path="/request-password-reset" element={<RequestPasswordReset/>} />
                <Route path="/reset-password/:id/:token" element={<ResetPassword/>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory/></ProtectedRoute>} />
                <Route path="/usermanagement" element={<ProtectedRoute><UserManagement/></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute><AdminOrderList /></ProtectedRoute>} />
                <Route path="/admin/orders/:orderId" element={<ProtectedRoute><AdminOrderDetail /></ProtectedRoute>} />
                <Route path="/userorders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
                <Route path="/userorders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/item-review/:orderId" element={<ItemReview />} />
            </Routes>
            <Footer/>
        </div>
        </AuthProvider>
      </Router>
      </StripeProvider>
    );
}

export default App;
