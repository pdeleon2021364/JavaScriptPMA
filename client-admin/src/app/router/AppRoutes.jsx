import { Routes, Route } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { DashboardPage } from "../../app/layouts/DashboardPage.jsx";
import { Users } from "../../features/users/components/Users.jsx";
import { Fields } from "../../features/fields/components/Fields.jsx";
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx";
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-email" element= {<VerifyEmailPage />}/>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} >
                <Route path="users" element={<Users />} />
                <Route path="fields" element={<Fields />} /> 
            </Route>
        </Routes>
    )
}
