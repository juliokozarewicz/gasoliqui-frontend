import { useState } from "react";
import './components/1_style/Main.css'
import { Route, Routes } from "react-router-dom";
import { ConfirmPage, ListPage, Nav,Sidenav, UploadPage } from "./components";

export default function App() {

    // states
    const [isSidenavVisible, setIsSidenavVisible] = useState(false);
    const [isMenuOpened, setIsMenuOpened] = useState(false);

    // prev state side menu
    const toggleSidenav = () => {
    setIsSidenavVisible(prevState => !prevState);
    };

    // prev state menu hamb
    const toggleMenu = () => {
        setIsMenuOpened(prevState => !prevState);
    };

    return (
        <div>
            <Nav
                toggleSidenav={toggleSidenav}
                toggleMenu={toggleMenu}
                isMenuOpened={isMenuOpened}
            />
            <section className='mainsection'>

                {
                    isSidenavVisible &&
                    <Sidenav
                        toggleSidenav={toggleSidenav}
                        toggleMenu={toggleMenu}
                    />
                }

                <main className="mainFrame">
                    <Routes>
                        <Route path="/" element={<UploadPage />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/confirm" element={<ConfirmPage />} />
                        <Route path="/list" element={<ListPage />} />
                    </Routes>
                </main>

            </section>
        </div>
    )

}
