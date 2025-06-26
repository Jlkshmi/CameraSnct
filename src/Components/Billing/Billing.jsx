import React, { useState, useEffect } from 'react';
import './Billing.css';

const defaultProducts = [
  { id: 1, name: 'Hikvision 2MP Camera', price: 1500 },
  { id: 2, name: 'CP Plus 5MP Camera', price: 2200 },
  { id: 3, name: 'Hikvision NVR 8 Channel', price: 5800 },
  { id: 4, name: 'CP Plus DVR 4 Channel', price: 3200 },
  { id: 5, name: 'Dahua Dome Camera', price: 1800 },
  { id: 6, name: 'Seagate 1TB HDD', price: 2500 },
  { id: 7, name: 'Dahua Bullet Camera', price: 2000 },
  { id: 8, name: 'POE Switch 8 Port', price: 3500 },
  { id: 9, name: 'Network Cable 90m', price: 1100 },
  { id: 10, name: 'CP Plus Power Supply', price: 900 },
];

function Billing() {
  const [products] = useState(defaultProducts);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(products);
  const [selectedItem, setSelectedItem] = useState(null);
  const [billingItems, setBillingItems] = useState([]);
  const [tax, setTax] = useState(0);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setFiltered(products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())));
  }, [search]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddItem = (item) => {
    setBillingItems(prev => [
      ...prev,
      {
        ...item,
        discount: 0,
        quantity: 1,
        amount: item.price
      }
    ]);
    setSearch('');
    setSelectedItem(null);
  };

  const handleRemoveItem = (index) => {
    setBillingItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      handleAddItem(filtered[0]);
    }
  };

  const updateDiscount = (index, value) => {
    const updated = [...billingItems];
    const discount = parseFloat(value) || 0;
    updated[index].discount = discount;
    updated[index].amount = updated[index].price * (1 - discount / 100);
    setBillingItems(updated);
  };

  const subtotal = billingItems.reduce((sum, item) => sum + item.amount, 0);
  const totalWithTax = subtotal + (subtotal * tax) / 100;
  const grandTotal = totalWithTax - (totalWithTax * globalDiscount) / 100;

  const printInvoice = () => {
    console.log('Printing:', { billingItems, tax, globalDiscount, subtotal, grandTotal }); // Debug log
    const printWindow = window.open('', '', 'width=800,height=600');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 1cm; }
          .logo { display: block; margin: 0 auto 20px; width: 150px; height: 50px; }
          .invoice-title { text-align: center; margin-bottom: 10px; }
          .invoice-header { text-align: center; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .summary { margin-top: 20px; text-align: right; }
          .footer { margin-top: 20px; font-size: 12px; }
          @page { size: A4; }
        </style>
      </head>
      <body>
        <img src="/images/logo camera.jpg" alt="Company Logo" class="logo" onerror="this.src='https://via.placeholder.com/150x50?text=Logo';">
        <h2 class="invoice-title">Invoice</h2>
        <p class="invoice-header">
          <strong>Date:</strong> ${currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}<br>
          <strong>Time:</strong> ${currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Rate (₹)</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${billingItems.length === 0 ? '<tr><td colspan="4" style="text-align: center; padding: 10px;">No items selected</td></tr>' : billingItems.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="summary">
          <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
          <p><strong>Tax (%):</strong> ${tax}</p>
          <p><strong>Discount (%):</strong> ${globalDiscount}</p>
          <p><strong>Grand Total:</strong> ₹${grandTotal.toFixed(2)}</p>
        </div>
        <div class="footer">
          <p>1. <strong>Warranty 12 months:</strong> Applicable on DVR, NVR, CAMERA, HDD & POE only</p>
          <p>2. <strong>Payment terms:</strong> 70% advance payment and 30% on completion</p>
          <p>3. <strong>This quote is valid for 10 days</strong></p>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <>
      <div style={styles.wrapper}>
        {/* LEFT SIDE: Product Entry */}
        <div style={styles.left}>
          <h2>Product Entry</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type product name..."
            style={styles.input}
          />
          {search && (
            <ul style={styles.dropdown}>
              {filtered.map((item) => (
                <li key={item.id} onClick={() => handleAddItem(item)} style={styles.option}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Discount (%)</th>
                <th>Amount (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {billingItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => updateDiscount(index, e.target.value)}
                      style={styles.discountInput}
                    />
                  </td>
                  <td>{item.amount.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE: Invoice (Screen View) */}
        <div style={styles.right}>
          <img
            src="/images/logo camera.jpg"
            alt="Company Logo"
            style={styles.logo}
            onError={(e) => {
              console.error('Failed to load logo:', e);
              e.target.src = 'https://via.placeholder.com/150x50?text=Logo';
            }}
          />
          <h2>Invoice</h2>
          <p><strong>Date:</strong> {currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
          <p><strong>Time:</strong> {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {billingItems.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                    No items selected
                  </td>
                </tr>
              ) : (
                billingItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={styles.summary}>
            <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
            <p>
              <strong>Tax (%):</strong>{' '}
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                style={styles.summaryInput}
              />
            </p>
            <p>
              <strong>Discount (%):</strong>{' '}
              <input
                type="number"
                value={globalDiscount}
                onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                style={styles.summaryInput}
              />
            </p>
            <p><strong>Grand Total:</strong> ₹{grandTotal.toFixed(2)}</p>
          </div>

          <div style={styles.footer}>
            <p>1. <strong>Warranty 12 months:</strong> Applicable on DVR, NVR, CAMERA, HDD & POE only</p>
            <p>2. <strong>Payment terms:</strong> 70% advance payment and 30% on completion</p>
            <p>3. <strong>This quote is valid for 10 days</strong></p>
          </div>

          <button onClick={printInvoice} style={styles.printButton}>🖨️ Print Invoice</button>
        </div>
      </div>
    </>
  );
}

// STYLES
const styles = {
  wrapper: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    fontFamily: 'Arial',
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    border: '1px solid #ccc',
    padding: '20px',
    backgroundColor: '#f8f8f8',
  },
  logo: {
    width: '150px',
    height: '50px',
    display: 'block',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
  },
  dropdown: {
    listStyle: 'none',
    border: '1px solid #ccc',
    maxHeight: '120px',
    overflowY: 'auto',
    padding: 0,
    marginBottom: 10,
  },
  option: {
    padding: '8px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  discountInput: {
    width: '60px',
  },
  summary: {
    marginTop: '20px',
  },
  summaryInput: {
    width: '60px',
    marginLeft: '10px',
  },
  printButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  removeButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  footer: {
    marginTop: '20px',
    fontSize: '14px',
  },
};

export default Billing;