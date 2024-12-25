import React, { useRef } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import data from '../data/data.json'
import { useEffect, useState } from 'react'
const Etudiant = () => {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const formRef = useRef();
    const [selectedCourse, setSelectedCourse] = useState('');

    const courses = [
        "Mathématiques",
        "Physique",
        "Chimie",
        "Informatique",
        "Français",
        "Anglais",
        "Histoire",
        "Géographie"
    ];

    useEffect(() => {
        setStudents(data);
    }, []);

    useEffect(() => {
        if (editingStudent) {
            setSelectedCourse(editingStudent.course);
        } else {
            setSelectedCourse('');
        }
    }, [editingStudent]);

    function addStudent(data) {
        const newStudent = {
            unique_id: students.length + 1,
            course: data.course,
            student: {
                id: data.studentId,
                firstname: data.firstName,
                lastname: data.lastName
            },
            date: data.date
        };
        setStudents(prevStudents => [...prevStudents, newStudent]);
    }

    function editStudent(updatedData) {
        setStudents(prevStudents => prevStudents.map(student =>
            student.unique_id === editingStudent.unique_id ? {
                ...student,
                course: updatedData.course,
                student: {
                    id: updatedData.studentId,
                    firstname: updatedData.firstName,
                    lastname: updatedData.lastName
                },
                date: updatedData.date
            } : student
        ));
        setEditingStudent(null);
        setSelectedCourse('');
    }

    function deleteStudent(unique_id) {
        setStudents(prevStudents => prevStudents.filter(student => student.unique_id !== unique_id));
    }

    function onSubmitData(event) {
        event.preventDefault();
        const data = new FormData(formRef.current);
        const newStudent = {};
        data.forEach((value, key) => {
            newStudent[key] = value;
        });

        if (editingStudent) {
            editStudent(newStudent);
        } else {
            addStudent(newStudent);
        }

        formRef.current.reset();
        setSelectedCourse('');
    }

    const renderForm = () => {
        return (
            <form ref={formRef} onSubmit={onSubmitData} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <input
                            className="form-control"
                            type="text"
                            name="studentId"
                            placeholder="ID de l'étudiant"
                            defaultValue={editingStudent ? editingStudent.student.id : ''}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            className="form-control"
                            type="text"
                            name="firstName"
                            placeholder="Prénom"
                            defaultValue={editingStudent ? editingStudent.student.firstname : ''}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            className="form-control"
                            type="text"
                            name="lastName"
                            placeholder="Nom"
                            defaultValue={editingStudent ? editingStudent.student.lastname : ''}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            name="course"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            required
                        >
                            <option value={editingStudent ? editingStudent.course : ''}>Sélectionner un cours</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <input
                            className="form-control"
                            type="date"
                            name="date"
                            defaultValue={editingStudent ? editingStudent.date : ''}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                            {editingStudent ? 'Modifier' : 'Ajouter'}
                        </button>
                        {editingStudent && (
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={() => {
                                    setEditingStudent(null);
                                    setSelectedCourse('');
                                }}
                            >
                                Annuler
                            </button>
                        )}
                    </div>
                </div>
            </form>
        );
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">{editingStudent ? 'Modifier un Etudiant' : 'Ajouter un Etudiant'}</h2>
            {renderForm()}

            {students.length > 0 && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Liste des Étudiants</h2>
                        <span className="badge bg-primary fs-5">
                            {students.length} étudiant{students.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Prénom</th>
                                    <th>Nom</th>
                                    <th>Cours</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.unique_id}>
                                        <td>{student.student.id}</td>
                                        <td>{student.student.firstname}</td>
                                        <td>{student.student.lastname}</td>
                                        <td>{student.course}</td>
                                        <td>{student.date}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => setEditingStudent(student)}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteStudent(student.unique_id)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};
export default Etudiant;