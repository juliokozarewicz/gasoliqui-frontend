import { Link } from 'react-router-dom';
import '../1_style/Sidenav.css';

interface NavProps {
  toggleSidenav: () => void;
  toggleMenu: () => void;
}

export function Sidenav(props:NavProps) {

    return (
            
      <div className='sidenav'>
        
        <div className='spacetopsidenav'></div>

        <button className='blackcurtainmenu' onClick={
            ()=>(
                props.toggleSidenav(),
                props.toggleMenu()
            )
        }></button>

        <div className='menuoptions'>
            <Link to="/upload" className='contentframe' onClick={
            ()=>(
                props.toggleSidenav(),
                props.toggleMenu()
            )
            }><p>upload</p></Link>

            <Link to="/confirm" className='contentframe' onClick={
            ()=>(
                props.toggleSidenav(),
                props.toggleMenu()
            )
            }><p>confirmar</p></Link>

            <Link to="/list" className='contentframe' onClick={
            ()=>(
                props.toggleSidenav(),
                props.toggleMenu()
            )
            }><p>conferir medições</p></Link>
        </div>

        </div>

    );
}
