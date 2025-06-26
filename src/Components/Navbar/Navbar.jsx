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
      <div style={styles.logo}>🖼️ MyLogo</div>
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
    backgroundColor: '#1e1e2f',
    color: 'white',
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
