import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Header from "./Header";

const Etudiant = () => {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (editingStudent) {
            setFormValues({
                firstName: editingStudent.firstName,
                lastName: editingStudent.lastName,
            });
        } else {
            setFormValues({
                firstName: "",
                lastName: "",
            });
        }
    }, [editingStudent]);

    const fetchStudents = async () => {
        try {
            const response = await fetch("http://localhost:8010/api/students");
            if (!response.ok) throw new Error("Erreur réseau");
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des étudiants:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editingStudent) {
                const response = await fetch(
                    `http://localhost:8010/api/students/edit/${editingStudent._id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formValues),
                    }
                );
                if (!response.ok) throw new Error("Erreur lors de la modification");

                const updatedStudent = await response.json();
                setStudents((prev) =>
                    prev.map((student) =>
                        student._id === updatedStudent._id ? updatedStudent : student
                    )
                );
                setEditingStudent(null);
            } else {
                const response = await fetch("http://localhost:8010/api/students", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formValues),
                });
                if (!response.ok) throw new Error("Erreur lors de l'ajout");

                const newStudent = await response.json();
                setStudents((prev) => [...prev, newStudent]);
            }
            setFormValues({
                firstName: "",
                lastName: "",
            });
        } catch (error) {
            console.error("Erreur lors de l'opération:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingStudent(null);
        setFormValues({
            firstName: "",
            lastName: "",
        });
    };

    const deleteStudent = async (id) => {
        try {
            const response = await fetch(`http://localhost:8010/api/students/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Erreur lors de la suppression");

            setStudents((prev) => prev.filter((student) => student._id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Header />
            <Typography variant="h4" align="center" gutterBottom>
                Gestion des Étudiants
            </Typography>

            <Grid container spacing={3}>
                {/* Formulaire */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {editingStudent ? "Modifier un Étudiant" : "Ajouter un Étudiant"}
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="Prénom"
                                    name="firstName"
                                    value={formValues.firstName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    label="Nom"
                                    name="lastName"
                                    value={formValues.lastName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddCircleIcon />}
                                    fullWidth
                                    style={{ marginTop: "15px" }}
                                >
                                    {editingStudent ? "Modifier" : "Ajouter"}
                                </Button>
                                {editingStudent && (
                                    <Button
                                        variant="outlined"
                                        onClick={handleCancelEdit}
                                        fullWidth
                                        style={{ marginTop: "10px" }}
                                    >
                                        Annuler
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tableau */}
                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Prénom</TableCell>
                                    <TableCell>Nom</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((student) => (
                                        <TableRow key={student._id}>
                                            <TableCell>{student.firstName}</TableCell>
                                            <TableCell>{student.lastName}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => setEditingStudent(student)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => deleteStudent(student._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={students.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
};

export default Etudiant;
