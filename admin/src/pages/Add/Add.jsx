import React, { useState } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    });

    const categories = [
        "Salad", "Rolls", "Deserts", "Sandwich", 
        "Cake", "Pure Veg", "Combo Meals", "Cold Drinks"
    ];

    const validateForm = () => {
        const newErrors = {};
        
        if (!data.name.trim()) {
            newErrors.name = "Product name is required";
        } else if (data.name.length < 2) {
            newErrors.name = "Product name must be at least 2 characters";
        }
        
        if (!data.description.trim()) {
            newErrors.description = "Product description is required";
        } else if (data.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        }
        
        if (!data.price) {
            newErrors.price = "Price is required";
        } else if (isNaN(data.price) || Number(data.price) <= 0) {
            newErrors.price = "Price must be a valid positive number";
        }
        
        if (!image) {
            newErrors.image = "Product image is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors below');
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append("name", data.name.trim());
            formData.append("description", data.description.trim());
            formData.append("price", Number(data.price));
            formData.append("category", data.category);
            formData.append("image", image);
            
            const response = await axios.post(`${url}/api/food/add`, formData);
            
            if (response.data.success) {
                toast.success(response.data.message || 'Product added successfully!');
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad"
                });
                setImage(false);
            } else {
                toast.error(response.data.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            
            setImage(file);
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: "" }));
            }
        }
        e.target.value = '';
    };

    return (
        <div className='add'>
            <div className='add-header'>
                <h2>Add New Product</h2>
                <p>Fill in the details below to add a new product to your menu</p>
            </div>
            
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <label className='form-label'>
                        Upload Image <span className='required'>*</span>
                    </label>
                    <input 
                        onChange={handleImageChange} 
                        type="file" 
                        accept="image/*" 
                        id="image" 
                        hidden 
                        disabled={loading}
                    />
                    <label htmlFor="image" className={`image-upload-label ${errors.image ? 'error' : ''}`}>
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="Upload" />
                        <span className='upload-text'>
                            {!image ? 'Click to upload image' : 'Click to change image'}
                        </span>
                    </label>
                    {errors.image && <span className='error-message'>{errors.image}</span>}
                </div>

                <div className='form-row'>
                    <div className='add-product-name flex-col'>
                        <label className='form-label'>
                            Product Name <span className='required'>*</span>
                        </label>
                        <input 
                            name='name' 
                            onChange={onChangeHandler} 
                            value={data.name} 
                            type="text" 
                            placeholder='Enter product name' 
                            className={errors.name ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.name && <span className='error-message'>{errors.name}</span>}
                    </div>

                    <div className='add-category flex-col'>
                        <label className='form-label'>Product Category</label>
                        <select 
                            name='category' 
                            onChange={onChangeHandler} 
                            value={data.category}
                            disabled={loading}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='add-product-description flex-col'>
                    <label className='form-label'>
                        Product Description <span className='required'>*</span>
                    </label>
                    <textarea 
                        name='description' 
                        onChange={onChangeHandler} 
                        value={data.description} 
                        rows={4} 
                        placeholder='Write a detailed description of your product...' 
                        className={errors.description ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.description && <span className='error-message'>{errors.description}</span>}
                </div>

                <div className='add-price flex-col'>
                    <label className='form-label'>
                        Product Price (₹) <span className='required'>*</span>
                    </label>
                    <input 
                        type="number" 
                        name='price' 
                        onChange={onChangeHandler} 
                        value={data.price} 
                        placeholder='0.00' 
                        min="0" 
                        step="0.01"
                        className={errors.price ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.price && <span className='error-message'>{errors.price}</span>}
                </div>

                <button 
                    type='submit' 
                    className={`add-btn ${loading ? 'loading' : ''}`} 
                    disabled={loading}
                >
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    )
}

export default Add
