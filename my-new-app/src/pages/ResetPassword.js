import { useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../config/config';
import { useSelector } from 'react-redux';

function ResetPassword() {
    // Prevent crash by checking if user exists
    const user = useSelector((state) => state.user?.user || null);
    const isLoggedIn = !!user?.email;

    const [email, setEmail] = useState(user?.email || '');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`${serverEndpoint}/auth/reset-password`, {
                email,
                code,
                newPassword
            });
            setMessage('Password has been reset successfully.');
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || 'Failed to reset password.');
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <h3 className="mb-4">Reset Password</h3>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {!isLoggedIn && (
                            <div className="mb-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            <label>Reset Code</label>
                            <input
                                type="text"
                                className="form-control"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-success w-100">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
