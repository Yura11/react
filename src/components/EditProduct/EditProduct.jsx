import "./EditProduct.css"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getProductById = async () => { // Define getProductById inside useEffect
            try {
                const response = await fetch(`http://localhost:5000/products/${id}`);
                const data = await response.json();
                setTitle(data.title);
                setPrice(data.price);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        getProductById(); // Call getProductById directly inside useEffect
    }, [id]); // Include id as the only dependency

    const updateProduct = async (e) => {
        e.preventDefault();
        const product = { title, price };
        await fetch(`http://localhost:5000/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        navigate('/');
    }
    
    return (
        <div>
            <form onSubmit={updateProduct}>
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
}

export default EditProduct;
