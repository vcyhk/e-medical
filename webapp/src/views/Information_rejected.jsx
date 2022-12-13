import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar.jsx';
import { Link } from 'react-router-dom';
import AppContext from '../context';
import axios from 'axios';
import {useTranslation} from 'react-i18next'

const Information = () => {
    const { t } = useTranslation('common');
    const { user, setUser } = useContext(AppContext);
    const [info, setInfo] = useState({
        birthday: '0000-00-00T00:00:00.000Z'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`/${user.is_doctor ? 'doctor' : 'patient'}/profile/${user.id}`,{
            headers: {
                Authorization: `${user.token}`,
            }
        })
            .then(res => {
                if (res.data.error) {
                    setError(true);
                } else {
                    setInfo(res.data);
                }
                setIsLoading(false);
            })
            .catch(err => {
                setError(true);
                setIsLoading(false);
            });
    }, []);



    return (
        <div className="information">
            <ActionBar back='/app/dashboard' title={t('information')} />
                {error && <div className='alert alert-danger'>{error}</div>}
                {isLoading && <div className='alert alert-info'>Loading...</div>}
            <div className="container">
                {!isLoading && <>
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
                                {user.is_doctor && <>
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
                                            Hopital
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
                                </>}
                                {!user.is_doctor && <>
                                    <tr>
                                        <td>
                                            Phone Number
                                        </td>
                                        <td>
                                            {info.phone_number}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Address
                                        </td>
                                        <td>
                                            {info.address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Birthday
                                        </td>
                                        <td>
                                            {/* change iso date string to year-month-day */
                                                info.birthday.split('T')[0].split('-')[0] + '-' + info.birthday.split('T')[0].split('-')[1] + '-' + info.birthday.split('T')[0].split('-')[2]
                                            }
                                        </td>
                                    </tr>
                                </>}
                            </tbody>
                        </table>
                    </div>
                    <div className='form-field' style={{textAlign:'center'}}>
                        <br />
                        <button>Update information</button>
                    </div>
                </>
                }
            </div>
        </div>
    );
};

export default Information;
