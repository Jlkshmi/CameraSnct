import React from 'react'
import { Route, Routes } from 'react-router-dom'
import BillingPages from '../Pages/BillingPages'

function UserRouter() {
  return (
    <>
    <Routes>
        <Route path='/' element={<BillingPages/>}/>
    </Routes>
    </>
  )
}

export default UserRouter