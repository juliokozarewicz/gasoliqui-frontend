import { useState } from 'react';
import logo from '../../assets/logo.png';
import '../1_style/Main.css'

interface NavProps {
    toggleSidenav: () => void;
    toggleMenu: () => void;
    isMenuOpened: boolean;
}

export function Nav(props: NavProps) {

    return (

        <nav className='navbar'>
            
            {
                props.isMenuOpened ? (
                    <button className='openedeMenuHambAll' onClick={
                        ()=>(
                            props.toggleSidenav(),
                            props.toggleMenu()
                        )
                    }>
                        <div className='linehambclose'></div>
                        <div className='linehambclose'></div>
                        <div className='linehambclose'></div>
                    </button>
                ) : (
                    <button className='closeMenuHambAll' onClick={
                        ()=>(
                            props.toggleSidenav(),
                            props.toggleMenu()
                        )
                    }>
                        <div></div>
                        <div></div>
                        <div></div>
                    </button>
                )
            }

            <img src={logo} alt="Logo" className='imglogo' />

            <div className='messageframeall'>
                <div className='messageframe' id='idmessageframe'>
                </div>
            </div>

        </nav>

    )
}