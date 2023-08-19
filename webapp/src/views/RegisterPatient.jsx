import React, { useState } from 'react';
import axios from 'axios';
import SecurityQuestion from '../components/SecurityQuestion';
import { useNavigate } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import Web3 from 'web3';

function RegisterPatient() {
    const navigate = useNavigate();
    // patient have
    // email, password, confirm_password, name, birthday, hkid, phone and address
    const [patient, setPatient] = useState({
        email: '',
        password: '',
        confirm_password: '',
        name: '',
        birthday: '',
        hkid: '',
        phone: '',
        address: '',
        wallet_address: '',
    })
    const [error, setError] = useState('')
    const [isNext, setIsNext] = useState(false)
    const [isConnect, setIsConnect] = useState(false)
    const [loading, setLoading] = useState(false)
    const [accounts, setCurrentAccount] = useState();

    const handleChange = (e) => {
        setPatient({
            ...patient,
            [e.target.name]: e.target.value
        })
    }

    // handle next button
    const handleNext = (e) => {
        e.preventDefault();
        
        patient.wallet_address = accounts;
        if (patient.email === '' || patient.password === '' || patient.confirm_password === '' || patient.name === '' || patient.birthday === '' || patient.hkid === '' || patient.phone === '' || patient.address === '' || patient.wallet_address === '' ) {
            setError('all fields are required')
        } else if (patient.password !== patient.confirm_password) {
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

    const connectMeta = async () => {
        setIsConnect(true);
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        setCurrentAccount(accounts[0]);
    }

    const handleSubmit = () => {
        setLoading(true)
        axios.post('/patient/register', {
            ...patient
        })
            .then(res => {
                //(res);
                if (res.data.error) {
                    setError(res.data.error)
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

    // change patient.birhday to iso date format
    const handleBirthday = (e) => {
        setPatient({
            ...patient,
            birthday: new Date(e.target.value).toISOString()
        })
    }

    if (isNext) {
        return (<SecurityQuestion handleBack={handleBack} handleChange={handleChange} handleSubmit={handleSubmit} data={patient} />)
    } else {
        return (
            <div className="register-patient container">
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
                            <input type="email" name="email" id="email" onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="password_confirm">Confirm Password</label>
                            <input type="password" name="confirm_password" id="password_confirm" onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="birhday">Birthday</label>
                            <input type="date" name="birthday" id="birthday" onChange={handleBirthday} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="hkid">HKID</label>
                            <input type="text" name="hkid" id="hkid" onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="text" name="phone" id="phone" onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="address">Address</label>
                            <input type="text" name="address" id="address" onChange={handleChange} required />
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
                        <div className="form-field" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button type="button" onClick={()=>{navigate(-1)}}>Cancel</button>
                            <button type="button" onClick={handleNext}>Next</button>
                        </div>
                    </form>
                </div>
            </div>

        );
    }
}

export default RegisterPatient;
