import { useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../config/config';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, { email });
            setMessage('Reset code sent to your email.');
            setTimeout(() => navigate('/reset-password'), 1500);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || 'Failed to send code. Try again.');
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <h3 className="mb-4">Forgot Password</h3>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="btn btn-primary w-100">Send Code</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
