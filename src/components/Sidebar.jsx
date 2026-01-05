// src/components/Sidebar.jsx
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaMusic, FaMoneyBill, FaCog } from 'react-icons/fa'
import ThemeContext from '../context/ThemeContext'

const Sidebar = () => {
  const { theme } = useContext(ThemeContext)

  return (
    <div className={`sidebar ${theme}`}>
      <ul>
        <li><Link to="/dashboard"><FaHome /> Dashboard</Link></li>
        <li><Link to="/library"><FaMusic /> Library</Link></li>
        <li><Link to="/payout"><FaMoneyBill /> Payout</Link></li>
        <li><Link to="/settings"><FaCog /> Settings</Link></li>
      </ul>
    </div>
  )
}

export default Sidebar