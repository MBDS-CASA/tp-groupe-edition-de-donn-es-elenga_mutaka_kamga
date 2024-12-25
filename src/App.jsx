import { useEffect, useState } from 'react'
import './App.css'
import { use } from 'react'
import data from './data/data.json'
import Etudiant from './Component/Etudiant'
import Matiere from './Component/Matiere'
import Note from './Component/Note'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';


const MENUS = [
  { title: 'NOTE' },
  { title: 'ETUDIANTS' },
  { title: 'MATIERES' },
  { title: 'RANDOM STUDENT' }
]


function Menu({ title, clickHandle, classname }) {
  return (
    <a className='d-inline p-5 text-white text-decoration-none bg-secondary menu' onClick={clickHandle}>
      <span className={classname}>
        {title}
      </span>
    </a>

  );
}



function Header() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState("");

  function onClickMenu(title) {
    setSelected(title);
  }
  const renderContent = () => {
    switch (selected) {
      case 'NOTE':
        return <Note />;
      case 'ETUDIANTS':
        return <Etudiant />;
      case 'MATIERES':
        return <Matiere />;
      case 'RANDOM STUDENT':
        return <Students />;
      default:
        return null;
    }
  };

  return (
    <header>
      <div className='container md-5'>

        <div id='examples'>
          {MENUS.map((menu, index) => (
            <Menu
              key={index}
              title={menu.title}
              clickHandle={() => onClickMenu(menu.title)}
              classname={selected == menu.title ? 'active' : null}

            />
          ))}

        </div>
        <img src="images.jpg" alt="React Logo" />
        <h3>Introduction à React</h3>
        <h6>A la découverte des premières notions de React</h6>

        {renderContent()}

      </div>
    </header>
  );
}
function MainContent() {
  const date = new Date();
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return (

    <main>
      <button className='btn btn-secondary'>{day} /{month} / {year}</button>   <button className='btn btn-danger'>{hour}:{minute}:{second}</button>

    </main>
  )
}


function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="fixed-bottom bg-dark text-white py-3">
      <div className="container text-center">
        © {year} - MUTAKA DANIEL, Tous droits réservés.
      </div>
    </footer>

  )
}


function App() {
  return (
    <>

      <div>
        <Header />
        <MainContent />
        <Footer />
      </div>

    </>
  )
}

export default App
