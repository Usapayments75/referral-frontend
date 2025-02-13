import React from 'react';

// Lazy load components
export const Login = React.lazy(() => import('../pages/Login'));
// export const Register = React.lazy(() => import('../pages/Register'));
export const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
export const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
export const Dashboard = React.lazy(() => import('../pages/Dashboard'));
export const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'));
export const UserManagement = React.lazy(() => import('../pages/admin/UserManagement'));
export const TutorialManagement = React.lazy(() => import('../pages/admin/TutorialManagement'));
export const UserSettings = React.lazy(() => import('../pages/UserSettings'));
export const Settings = React.lazy(() => import('../pages/admin/Settings'));
export const SubmitReferral = React.lazy(() => import('../pages/SubmitReferral'));
export const Tutorials = React.lazy(() => import('../pages/Tutorials'));
export const Compensation = React.lazy(() => import('../pages/Compensation'));
export const SubAccounts = React.lazy(() => import('../pages/SubAccounts'));