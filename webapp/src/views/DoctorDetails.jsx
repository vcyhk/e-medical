import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar';
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AppContext from '../context';
import { useTranslation } from 'react-i18next'
import Web3 from 'web3';
import medicalApp from '../contracts/medicalApp';


function DoctorDetails() {
  const { t } = useTranslation('common');
  const { user } = useContext(AppContext);
  const param = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [patData, setPatData] = useState(null);
  const [accounts, setCurrentAccount] = useState();
  const [connect, setConnect] = useState(false);
  const [checkAdd, setCheckAdd] = useState(false);

  useEffect(() => {
    load();
    setLoading(true);
    axios.get(`/doctor/profile/${param.dc_id}`, {
      headers: {
        Authorization: `${user.token}`,
      }
    })
      .then(res => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setInfo(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    axios.get(`/patient/profile/${user.id}`, {
      headers: {
        Authorization: `${user.token}`,
      }
    })
      .then(res => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setPatData(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Connect wallet and load wallet address
  async function load() {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    setCurrentAccount(accounts[0]);
  }

  // Connect and check Wallet is valid
  const connectWallet = () => { 
    load();
    if(accounts === patData.wallet_address){
      setConnect(true);
      setCheckAdd(true);
    }else{
      setConnect(true)
      setCheckAdd(false)
    }
  };

  const logout = () => { 
      load();
      setConnect(false)
      setCheckAdd(false)
  }

  
  const handleRegister = async(e) => {
    const doctorAddress = await info.wallet_address;
    await medicalApp.methods.regDoctorPermit(doctorAddress).send({
      from: accounts,
    });

    if (accounts === patData.wallet_address){
      e.target.disabled = true;
      e.target.innerText = 'Registering...';
      let data = JSON.stringify({
        doctor_id: info.id,
      })
  
      axios.post('/mailboxes', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${user.token}`,
        }
      })
        .then(res => {
          if (res.data.error) {
            setError(res.data.error);
          } else {
            alert(`Doctor can view your medical records now`);
            navigate(`/app/dashboard/hospitals/${param.h_id}/departments/${param.d_id}/doctors`);
          }
          e.target.disabled = false;
          e.target.innerText = 'Register';
        })
        .catch(err => {
          setError(err);
          e.target.disabled = false;
          e.target.innerText = 'Register';
        });
    }else{
      alert("Wrong address")
    }

  };

  return (
    <div className="doctor-details">
      <ActionBar back={`/app/dashboard/hospitals/${param.h_id}/departments/${param.d_id}/doctors`} title={t('doctor_details')} />
      {error && <div className='alert alert-danger'>{error}</div>}
      {loading && <div className='alert alert-info'>Loading...</div>}
      <div className="container">
        {!loading && <>
          <div className="information-box">
            <table style={{ backgroundColor: 'white', padding: '20px', width: '100%' }}>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{info.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{info.email}</td>
                </tr>

                <tr>
                  <td>
                    Registration Number
                  </td>
                  <td>
                    {info.registration_number}
                  </td>
                </tr>
                <tr>
                  <td>
                    Hospital
                  </td>
                  <td>
                    {info.hospital}
                  </td>
                </tr>
                <tr>
                  <td>
                    Department
                  </td>
                  <td>
                    
                    {info.department}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {!connect ?
          <div className='form-field-blockchain' style={{ textAlign: 'center' }}>
            <br />
            <button onClick={connectWallet}>Connect Wallet</button>
            <div>
              Please connect your wallet.
            </div>
            <br />
          </div> : !checkAdd ?
            <div style={{ textAlign: 'center' }}>
              <br />
              <div className='form-field-blockchain'>
                <button onClick={logout}>Connect Again</button>
              </div>
              <div>
              <b>Please try again.<br />
                Your wallet address is unauthorized.</b>
              </div>
              <div>
                Your wallet address is: {accounts}
              </div>
              <br />
            </div>
            :
            <div style={{ textAlign: 'center' }}>
              <br />
              <div className='form-field-blockchain'>
                <button onClick={logout}>Disconnect</button>
              </div>
              <div>
                Your wallet address is: {accounts}
              </div>
              <br />
              <div className='form-field' style={{ textAlign: 'center' }}>
                <button onClick={handleRegister}>Register</button>
              </div>
              <br />
            </div>
          }
        </>
        }
      </div>
    </div>
  );
}

export default DoctorDetails;
