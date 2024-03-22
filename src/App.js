import React, { useEffect, useState } from 'react';
import './App.css';
import About from './components/About/About';
import ProductList from './components/ProductList/ProductList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bulma/css/bulma.css";
import Contact from './components/Contact/Contact';
import AddProduct from './components/AddProduct/AddProduct';
import EditProduct from './components/EditProduct/EditProduct';
import Header from './components/Header/Header';

function App() {
  const [title, setTitle] = useState("Hello, students!");

  
  const [products, setProducts] = useState([]); 
  

  const clickMe = () => {
    setTitle('Title is changed!');
    console.log("It's clicked!");
  };

  const deleteProduct = (productId) => {
    const newProducts = products.filter(product => product.id !== productId );
    setProducts(newProducts);
  };

  const [name, setName] = useState('Yura');

  useEffect(() => {
    console.log('useEffect');
  }, [name]);

  return (
    <div>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProductList products={ products } deleteProduct={ deleteProduct } />} />
          <Route path='/about' element={<About/>}></Route>
          <Route path='/contact' element={<Contact/>}></Route>
          <Route path='/add' element={<AddProduct/>}></Route>
          <Route path='/edit/:id' element={<EditProduct/>}></Route>
        </Routes>
      </BrowserRouter>
  
      <div>
        <button className="button is-primary mt-5" onClick={() => { setName('John') }}>Change name</button>
        <p>Name: {name}</p>
      </div>
    </div>
  );
}

export default App;