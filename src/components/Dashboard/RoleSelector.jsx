import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import './RoleSelector.css';

const RoleSelector = () => {
  const { currentRole, dispatch } = useFinance();

  const handleRoleChange = (e) => {
    dispatch({ type: 'SET_ROLE', payload: e.target.value });
  };

  return (
    <div className="role-selector">
      <label className="role-selector__label">
        <span className="role-selector__icon">👤</span>
        Current Role:
      </label>
      <select 
        className="role-selector__dropdown"
        value={currentRole}
        onChange={handleRoleChange}
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
      <span className={`role-badge role-badge--${currentRole}`}>
        {currentRole === 'admin' ? 'Full Access' : 'View Only'}
      </span>
    </div>
  );
};

export default RoleSelector;
