import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {FaUserGraduate, FaUserEdit} from 'react-icons/fa';
import logo from '../assets/logo.svg';
import RegisterForm from './Register';
import Login from './Login';
import {IoIosLogOut} from "react-icons/io";
import {logout} from '../reducers/userSlice.js';
import {CiSettings} from "react-icons/ci";
import {CiUser} from "react-icons/ci";
import {useNavigate} from 'react-router-dom';
import {IoIosBuild} from "react-icons/io";

function Modal({isOpen, onClose, formType}) {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="modal-box relative bg-slate-700 p-5 rounded flex justify-center"
                 onClick={e => e.stopPropagation()}>
                <div className="w-4/5">
                    {formType === 'register' ? <RegisterForm/> : <Login/>}
                </div>
            </div>
        </div>
    );
}

function Navbar() {
    const navigate = useNavigate();
    const nav = () => {
        navigate('/home');
    };
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formType, setFormType] = useState('register');

    return (
        <>
            <div className="navbar h-24 bg-current flex items-center justify-between z-10">
                <div className="flex-grow flex justify-center">
                    <div className="flex flex-col items-center ml-40">
                        <img src={logo} alt="Logo" className="w-20 mt-2 cursor-pointer" onClick={nav}/>
                        <button className="btn btn-ghost text-2xl text-black">Studenci Lublin</button>
                    </div>
                </div>

                <div className="flex">
                    {!user ? (
                        <>
                            <button onClick={() => {
                                setFormType('login');
                                setIsModalOpen(true);
                            }}
                                    className="btn mr-2 px-4 py-2 bg-blue-800 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out">
                                <FaUserGraduate/> Logowanie
                            </button>
                            <button onClick={() => {
                                setFormType('register');
                                setIsModalOpen(true);
                            }}
                                    className="btn px-4 py-2 bg-green-800 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out">
                                <FaUserEdit/> Rejestracja
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex-none gap-3 mr-14">
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button"
                                         className="btn btn-ghost btn-circle avatar flex items-center text-lg w-14 h-14">
                                        <img src={user.picture} alt="User Avatar" className="rounded-full"/>
                                    </div>

                                    <ul tabIndex={0}
                                        className="bg-slate-600 mt-4 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64">
                                        {/* Zwiększony padding i szerokość */}
                                        <li>
                                            <a className="justify-between text-lg" style={{pointerEvents: 'none'}}>
                                                {user.first_name} {user.last_name}
                                            </a>
                                        </li>

                                        <li><a className="text-lg"><CiUser className="mt-0.5 w-6 h-6"/> Profile</a>
                                        </li>

                                        <li><a className="text-lg"><CiSettings
                                            className="mt-1 w-6 h-6"/> Settings</a>
                                        </li>

                                        <li>
                                            <button onClick={() => {
                                                dispatch(logout());
                                                location.reload();
                                            }} className="flex items-center text-left text-lg">
                                                <IoIosLogOut className="mt-1 w-6 h-6"/>
                                                <p className="m-0">Logout</p>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formType={formType}/>

            <div className="z-0 navbar flex justify-center pt-0 pb-0">
                <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box w-full flex justify-center">
                    <li><a href="Zlote">Złote stony</a></li>
                    <li><a href="Chat">Chat</a></li>
                    <li><a href="Announcements">Ogłoszenia</a></li>
                    <li><a href="#!">Zniżki studenckie</a></li>
                    <li><a href="#!">Kalendarz wydarzeń<IoIosBuild className="text-2xl"/></a></li>
                    <li><a href="#!">Spotkania integracyjne<IoIosBuild className="text-2xl"/></a></li>
                    <li><a href="#!">Turnieje<IoIosBuild className="text-2xl"/></a></li>
                    <li><a href="#!">Forum<IoIosBuild className="text-2xl"/></a></li>
                </ul>
            </div>
        </>
    );
}

export default Navbar;
