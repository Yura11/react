import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'; 

const AddProduct = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    const saveProduct = async (e) => {
        e.preventDefault();
        if (!title || !price) {
            console.error('Title and price are required.');
            return;
        }
    
        const id = uuidv4(); 
        const product = { id, title, price };
        
        try {
            const response = await fetch(`http://localhost:5000/products`, {
                method: "POST",
                body: JSON.stringify(product), 
                headers: {
                    'Content-Type': 'application/json' 
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to add product.');
            }
    
            navigate('/');
        } catch (error) {
            console.error('Error adding product:', error.message);
        }
    };

    return (
        <div>
            <form onSubmit={saveProduct}>
                <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Price</label>
                    <div className="control">
                        <input className="input" value={price} onChange={(e) => setPrice(e.target.value)} type="text" placeholder="Price" />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button className="button is-primary">Save</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
