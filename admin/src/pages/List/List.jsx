import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    price: ''
  });

  const categories = [
    "Salad",
    "Rolls",
    "Deserts",
    "Sandwich",
    "Cake",
    "Pure Veg",
    "Combo Meals",
    "Cold Drinks"
  ];

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error")
    }
  }

  const startEditing = (item) => {
    setEditingId(item._id);
    setEditForm({
      name: item.name,
      category: item.category,
      price: item.price
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const saveEdit = async (id) => {
    try {
        const response = await axios.post(`${url}/api/food/update`, {
            id: id,
            ...editForm
        });
        if (response.data.success) {
            toast.success("Food item updated successfully");
            setEditingId(null);
            await fetchList();
        } else {
            toast.error(response.data.message || "Error updating food item");
        }
    } catch (error) {
        console.error('Update error:', error);
        toast.error("Error updating food item");
    }
};

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
        <header>
            <div className="header-left">
                <h1 className="header-title">Food Items Management</h1>
                <span className="header-subtitle">Manage your menu items efficiently</span>
            </div>
            <div className="total-items">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <span>Total Items: {list.length}</span>
            </div>
        </header>
        <div className='list-table'>
          <div className="list-table-format title">
            <b>Preview</b>
            <b>Item Details</b>
            <b>Category</b>
            <b>Price</b>
            <b>Actions</b>
          </div>
          {list.map((item, index) => {
            return (
              <div key={index} className='list-table-format'>
                <img 
                  src={`${url}/images/` + item.image} 
                  alt={item.name}
                  loading="lazy"
                />
                {editingId === item._id ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      placeholder="Item name"
                    />
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="category-select"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      min="0"
                      step="1"
                    />
                    <div className='action-buttons'>
                      <button onClick={() => saveEdit(item._id)}>
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="item-name">{item.name}</p>
                    <p className="item-category">{item.category}</p>
                    <p className="item-price">{currency}{item.price}</p>
                    <div className='action-buttons'>
                      <button onClick={() => startEditing(item)}>
                        Edit
                      </button>
                      <button onClick={() => removeFood(item._id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
  )
}

export default List
