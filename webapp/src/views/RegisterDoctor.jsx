import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SecurityQuestion from '../components/SecurityQuestion';
import Collapsible from 'react-collapsible';
import Web3 from 'web3';

function RegisterDoctor() {
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState({
        email: '',
        password: '',
        confirm_password: '',
        name: '',
        registration_number: '',
        hospital: '',
        department: '',
        wallet_address: '',
    })
    const [isNext, setIsNext] = useState(false)
    const [isConnect, setIsConnect] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [accounts, setCurrentAccount] = useState();

    const handleChange = (e) => {
        setDoctor({
            ...doctor,
            [e.target.name]: e.target.value
        })
    }

    // handle next button
    const handleNext = (e) => {
        e.preventDefault();
        doctor.wallet_address = accounts;
        if (doctor.email === '' || doctor.password === '' || doctor.confirm_password === '' || doctor.name === '' || doctor.registration_number === '' || doctor.hospital === '' || doctor.department === '' || doctor.wallet_address === '' ) {
            setError('all fields are required')
        } else if (doctor.password !== doctor.confirm_password) {
            setError('password and confirm password must be the same')
        } else {
            setError('')
            setIsNext(true)
        }
    }

    // handle back
    const handleBack = (e) => {
        e.preventDefault();
        setIsNext(false)
    }

    const handleSubmit = () => {
        setLoading(true)
        axios.post('/doctor/register', {
            ...doctor
        })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error)
                    setIsNext(false)
                } else {
                    alert('Register success!, Please login')
                    navigate('/login')
                }
                setLoading(false)
            })
            .catch(err => {
                console.log(err);
                setLoading(false)
            });
    }
    const connectMeta = async () => {
        setIsConnect(true);
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        setCurrentAccount(accounts[0]);
    }

    if (isNext) {
        return (
            <SecurityQuestion handleBack={handleBack} handleChange={handleChange} handleSubmit={handleSubmit} data={doctor} loading={loading} />
        )
    } else {

        return (
            <div className="register-doctor container">
                <div className="form">
                    <div>
                        <h2>Please enter your data</h2>
                        <p>
                            We only use your data for varification purposes.
                            <br />
                            Please fill in all the queries.
                        </p>
                    </div>
                    {/* display error */}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form>
                        <div className="form-field">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" name="email" id="email" onChange={handleChange} value={doctor.email} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" onChange={handleChange} value={doctor.password} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <input type="password" name="confirm_password" id="confirm_password" onChange={handleChange} value={doctor.confirm_password}/>
                        </div>
                        <div className="form-field">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" onChange={handleChange} value={doctor.name} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="registration_no">Registration Number</label>
                            <input type="text" name="registration_number" id="registration_no" onChange={handleChange} value={doctor.registration_number} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="hospital">Hospital</label>
                            <input type="text" name="hospital" id="hospital" onChange={handleChange} value={doctor.hospital} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="specialization">Specialization</label>
                            <input type="text" name="department" id="specialization" onChange={handleChange} value={doctor.department} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="wallet_add">Wallet Address</label>
                            <label><Collapsible trigger="▷ How can I find my wallet address ?" classParentString ="col-row1">
                            <p>
                                We highly recommend using MetaMask to connect.<br/>
                                1. Login your Metamask account.<br/>
                                2. Connect your Ethereum Address. (e.g. 0x......)<br/>
                                Note: After you select the address, you are not allow to change it.<br/>
                                If you have any questions, please contact the admin.
                            </p>
                            </Collapsible></label>
                            {!isConnect?
                            <div className='form-field-blockchain' style={{ textAlign: 'center' }}> 
                                <button type="button" onClick={connectMeta}>Connect MetaMask</button>
                            </div>
                            :
                            <div style={{ textAlign: 'center', margin:'20px 0px'}}>
                            {accounts}<br /> 
                            Connected
                            </div>
                            }
                        </div> 
                        <div className="form-field"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <button type='button' onClick={() => navigate(-1)}>Cancel</button>
                            <button type='button' onClick={handleNext}>Next</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default RegisterDoctor;
