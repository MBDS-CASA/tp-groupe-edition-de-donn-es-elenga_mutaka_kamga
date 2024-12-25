import { useEffect, useState } from 'react'
import './App.css'
import { use } from 'react'
import data from './data/data.json'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';


const MENUS = [
  { title: 'NOTE' },
  { title: 'ETUDIANTS' },
  { title: 'MATIERES' },
  { title: 'RANDOM STUDENT' }
]

function NOTE() {
  const [studentData, setStudentData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setStudentData(data);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="student grades table">
          <TableHead>
            <TableRow>
              <TableCell>ETUDIANT</TableCell>
              <TableCell align="center">Cours</TableCell>
              <TableCell align="right">Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow
                key={item.unique_id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: '#f5f5f5' },  // Survol avec une couleur de fond
                }}
              >
                <TableCell>{item.student.firstname} {item.student.lastname}</TableCell>
                <TableCell align="center">{item.course}</TableCell>
                <TableCell align="right" className={(item.grade >= 80 ? 'text-black' : 'text-danger')}>{item.grade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={studentData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}


function ETUDIANTS() {
  const [studentData, setStudentData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setStudentData(data);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="student table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Cours</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow
                  key={item.unique_id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <TableCell>{item.student.id}</TableCell>
                  <TableCell>{item.student.lastname}</TableCell>
                  <TableCell>{item.student.firstname}</TableCell>
                  <TableCell>{item.course}</TableCell>
                  <TableCell>{item.grade}</TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={studentData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}


function MATIERES() {
  const [studentData, setStudentData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setStudentData(data);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="courses table">
          <TableHead>
            <TableRow>
              <TableCell>Cours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow
                  key={item.unique_id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <TableCell>{item.course}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={studentData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

function Menu({ title, clickHandle, classname }) {
  return (
    <a className='d-inline p-5 text-white text-decoration-none bg-secondary menu' onClick={clickHandle}>
      <span className={classname}>
        {title}
      </span>
    </a>

  );
}



function Header(props) {
  const [selected, setSelected] = useState("");

  function onClickMenu(title) {
    setSelected(title);
  }
  const renderContent = () => {
    switch (selected) {
      case 'NOTE':
        return <NOTE />;
      case 'ETUDIANTS':
        return <ETUDIANTS />;
      case 'MATIERES':
        return <MATIERES />;
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
function Students() {
  const data = [
    {
      "unique_id": 1,
      "course": "Math 101",
      "student": {
        "firstname": "Matthew",
        "lastname": "Gonzalez",
        "id": 2128
      },
      "date": "2023-02-10",
      "grade": 99
    },
    {
      "unique_id": 2,
      "course": "Physics 505",
      "student": {
        "firstname": "Kevin",
        "lastname": "Green",
        "id": 7912
      },
      "date": "2022-11-01",
      "grade": 64
    },
    {
      "unique_id": 3,
      "course": "Chemistry 606",
      "student": {
        "firstname": "James",
        "lastname": "Murphy",
        "id": 5589
      },
      "date": "2022-02-20",
      "grade": 64
    },
    {
      "unique_id": 4,
      "course": "Math 101",
      "student": {
        "firstname": "Johnny",
        "lastname": "Cox",
        "id": 8569
      },
      "date": "2021-11-11",
      "grade": 59
    },
    {
      "unique_id": 5,
      "course": "Math 101",
      "student": {
        "firstname": "Cynthia",
        "lastname": "Clay",
        "id": 2864
      },
      "date": "2023-04-04",
      "grade": 80
    },
    {
      "unique_id": 6,
      "course": "History 303",
      "student": {
        "firstname": "Scott",
        "lastname": "Thompson",
        "id": 2797
      },
      "date": "2022-11-07",
      "grade": 99
    },
    {
      "unique_id": 7,
      "course": "Physics 505",
      "student": {
        "firstname": "Jessica",
        "lastname": "Miller",
        "id": 8264
      },
      "date": "2023-12-26",
      "grade": 70
    },
    {
      "unique_id": 8,
      "course": "Biology 404",
      "student": {
        "firstname": "Stephanie",
        "lastname": "White",
        "id": 1864
      },
      "date": "2020-04-27",
      "grade": 51
    },
    {
      "unique_id": 9,
      "course": "Biology 404",
      "student": {
        "firstname": "Andrea",
        "lastname": "Anderson",
        "id": 4137
      },
      "date": "2020-03-19",
      "grade": 65
    },
    {
      "unique_id": 10,
      "course": "Physics 505",
      "student": {
        "firstname": "Jennifer",
        "lastname": "Sanchez",
        "id": 3816
      },
      "date": "2023-02-08",
      "grade": 79
    },

  ];

  const [nombres, setnombres] = useState(Math.floor(Math.random() * 10))
  const student = data[nombres];
  return (
    <div>
      <Student
        unique_id={student.unique_id}
        course={student.course}
        student={student.student}
        date={student.date}
        grade={student.grade}
      />
      <div onClick={() => { setnombres(Math.floor(Math.random() * 10)) }} className='btn btn-primary'>Generer </div>

    </div>
  )
}
function Student({ unique_id, course, student, date, grade }) {

  return (
    <section>
      <table className='table'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Course</th>
            <th>Student</th>
            <th>Date</th>
            <th>grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{unique_id}</td>
            <td>{course}</td>
            <td>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>FirstName</th>
                    <th>LastName</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{student.id}</td>
                    <td>{student.firstname}</td>
                    <td>{student.lastname}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td>{date}</td>
            <td>{grade}</td>
          </tr>
        </tbody>
      </table>
    </section>
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

function Ajoutercour() {
  const [cour, setCour] = useState({
    name: ""
  })
  function onDataChange(event) {
    setCour({
      ...cour,
      [event.target.name]: event.target.value
    })
  }
  function onSubmmit() {
    console.log(cour.name)
  }

  return (
    <>
      <p>Vous avez rentré {name}</p>
      <form className='form'>
        <input type='text' name='cour' placeholder='Entrez un cour' onChange={onDataChange} value={cour.name} />
        <button className='btn btn-primary' onClick={onSubmmit} type='button'>submit</button>
      </form>
    </>
  )

}


function App() {



  return (
    <>

      <div>
        <Header />
        <MainContent />
      </div>

    </>
  )
}

export default App
