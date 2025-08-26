import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';
import Logo from '../../assets/logoforbill.png';

const Order = () => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`)
    if (response.data.success) {
      setOrders(response.data.data.reverse());
    }
    else {
      toast.error("Error")
    }
  }

  const statusHandler = async (event, orderId) => {
    console.log(event, orderId);
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  const generateBill = (order) => {
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none';
    document.body.appendChild(printFrame);
    
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    const orderTime = new Date(order.createdAt).toLocaleTimeString();
    const gstRate = 0.18;
    const subtotal = order.amount / (1 + gstRate);
    const gstAmount = order.amount - subtotal;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${order._id.slice(-6)}`;
    
    printFrame.contentWindow.document.open();
    printFrame.contentWindow.document.write(`
      <html>
        <head>
          <title>Tax Invoice - ${invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { margin: 0; padding: 30px; background: #f8f8f8; }
            .bill-container { 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px 60px; 
              background: white; 
              font-family: 'Inter', sans-serif;
              box-shadow: 0 0 25px rgba(0,0,0,0.1);
              position: relative;
              border-radius: 12px;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 100px;
              opacity: 0.03;
              pointer-events: none;
              white-space: nowrap;
            }
            .brand-header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            .brand-name { 
              font-size: 28px; 
              font-weight: 700; 
              color: #1a1a1a; 
              margin: 0;
              letter-spacing: -0.5px;
            }
            .brand-logo { 
              width: 80px; 
              height: 80px; 
              background: #f8f8f8;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            .brand-logo img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              padding: 10px;
            }
            .invoice-title { 
              font-size: 20px; 
              color: #1a1a1a; 
              margin: 30px 0; 
              letter-spacing: -0.3px;
            }
            .invoice-meta { 
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin: 30px 0;
              font-size: 14px;
              line-height: 1.6;
            }
            .bill-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0;
              font-size: 14px;
            }
            .bill-table th { 
              background: #f8f8f8; 
              font-weight: 600;
              color: #1a1a1a;
            }
            .bill-table th, .bill-table td { 
              padding: 12px 15px; 
              text-align: left; 
              border-bottom: 1px solid #eee;
            }
            .amount-breakdown { 
              margin-left: auto; 
              width: 300px;
              font-size: 14px;
            }
            .amount-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0;
              color: #666;
            }
            .amount-total { 
              font-weight: 600;
              font-size: 16px;
              color: #1a1a1a;
              margin-top: 12px;
              padding-top: 12px;
              border-top: 2px solid #eee;
            }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 13px;
              color: #666;
            }
            .payment-info {
              background: #f8f8f8;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
              font-size: 13px;
            }
            @media print { 
              body { background: white; padding: 0; }
              .bill-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <div class="watermark">Myfoodie</div>
            <div class="brand-header">
              <div>
                <h1 class="brand-name">Myfoodie</h1>
                <p style="color: #666; margin: 5px 0 0; font-size: 13px;">Your Trusted Food Partner</p>
              </div>
              <div class="brand-logo">
                <img src="${Logo}" alt="Myfoodie Logo" />
              </div>
            </div>
            
            <h2 class="invoice-title">TAX INVOICE</h2>
            
            <div class="invoice-meta">
              <div>
                <p style="color: #666;">Invoice Details</p>
                <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
                <p><strong>Date:</strong> ${orderDate}</p>
                <p><strong>Time:</strong> ${orderTime}</p>
                <p><strong>GSTIN:</strong> 29ABCDE1234F1Z5</p>
              </div>
              <div>
                <p style="color: #666;">Billed To</p>
                <p><strong>${order.address.firstName} ${order.address.lastName}</strong></p>
                <p>${order.address.street}</p>
                <p>${order.address.city}, ${order.address.state}</p>
                <p>${order.address.country} - ${order.address.zipcode}</p>
                <p>Phone: ${order.address.phone}</p>
              </div>
            </div>

            <table class="bill-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${currency}${item.price.toFixed(2)}</td>
                    <td style="text-align: right;">${currency}${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="amount-breakdown">
              <div class="amount-row">
                <span>Subtotal:</span>
                <span>${currency}${subtotal.toFixed(2)}</span>
              </div>
              <div class="amount-row">
                <span>GST (18%):</span>
                <span>${currency}${gstAmount.toFixed(2)}</span>
              </div>
              <div class="amount-row amount-total">
                <span>Total Amount:</span>
                <span>${currency}${order.amount.toFixed(2)}</span>
              </div>
            </div>

            <div class="payment-info">
              <p style="margin: 0 0 10px; font-weight: 600;">Payment Information</p>
              <p style="margin: 5px 0;">Bank: EXAMPLE BANK</p>
              <p style="margin: 5px 0;">A/C No: XXXX-XXXX-XXXX-1234</p>
              <p style="margin: 5px 0;">IFSC: EXBK0000123</p>
              <p style="margin: 5px 0;">UPI: payments@foodieskitchen</p>
            </div>

            <div class="footer">
              <p style="margin: 0 0 5px;">Thank you for choosing Myfoodie!</p>
              <p style="margin: 0 0 5px;">This is a computer-generated invoice and does not require a physical signature.</p>
              <p style="margin: 0;">For support: support@foodieskitchen.com | +1 (555) 123-4567</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printFrame.contentWindow.document.close();

    // Wait for content and styles to load
    printFrame.onload = () => {
      printFrame.contentWindow.print();
      // Remove the iframe after printing
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    };
  };

  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  }
                  else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>{currency}{order.amount}</p>
            <div className="order-controls">
              <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <div className="control-buttons">
                {order.status === "Food Processing" && (
                  <button onClick={() => generateBill(order)} className="bill-button">
                    <span>📄</span>
                    Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order

