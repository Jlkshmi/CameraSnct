import React, { useState, useEffect } from 'react';

function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  return (
    <div style={styles.navbar}>
      <div style={styles.logo}>
        <img src='\images\logo camera.jpg' style={{width:"50px"}}/>
        <h3 style={{color:"#b19c31", margin:"0"}}>PIXEL SNCT</h3>
        <p style={{margin:"0",color:"#b19c31", fontFamily:"Times New Roman"}}>Networks & CCTV Security</p>
        </div>
      <div style={styles.datetime}>
        {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#cdcdcd',
    color: 'Black',
    padding: '10px 20px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px'
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '18px'
  },
  datetime: {
    fontFamily: 'monospace'
  }
};

export default Navbar;
