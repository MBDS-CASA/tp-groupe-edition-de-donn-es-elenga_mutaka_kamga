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
    Snackbar,
    Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Header from "./Header";

const Etudiant = () => {
    // États de base
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour la pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // État pour le formulaire
    const [editingStudent, setEditingStudent] = useState(null);
    const [formValues, setFormValues] = useState({
        FirstName: "",
        LastName: "",
        age: "",
        email: "",
        phone: "",
        grade_id: "",
        courses: "",
    });

    // Chargement initial des données
    useEffect(() => {
        fetchStudents();
    }, []);

    // Fonction pour charger les étudiants
    const fetchStudents = async () => {
        try {
            const response = await fetch("http://localhost:8010/api/students");
            if (!response.ok) throw new Error("Erreur de chargement");
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            setError("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    // Gestion des changements dans le formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingStudent 
                ? `http://localhost:8010/api/students/edit/${editingStudent._id}`
                : "http://localhost:8010/api/students";

            const response = await fetch(url, {
                method: editingStudent ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) throw new Error();
            
            await fetchStudents();
            setFormValues({
                FirstName: "",
                LastName: "",
                age: "",
                email: "",
                phone: "",
                grade_id: "",
                courses: "",
            });
            setEditingStudent(null);
        } catch (err) {
            setError("Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    // Suppression d'un étudiant
    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ?")) return;
        
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8010/api/students/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error();
            await fetchStudents();
        } catch (err) {
            setError("Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    // Si chargement initial
    if (loading && students.length === 0) {
        return <div>Chargement...</div>;
    }

    // Si erreur fatale
    if (error && students.length === 0) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Header />
            
            {/* Formulaire */}
            <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Prénom"
                                    name="FirstName"
                                    value={formValues.FirstName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    name="LastName"
                                    value={formValues.LastName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Age"
                                    name="age"
                                    type="number"
                                    value={formValues.age}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formValues.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {editingStudent ? "Modifier" : "Ajouter"}
                                </Button>
                                {editingStudent && (
                                    <Button
                                        onClick={() => setEditingStudent(null)}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Annuler
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {/* Tableau */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((student) => (
                                <TableRow key={student._id}>
                                    <TableCell>{student.FirstName}</TableCell>
                                    <TableCell>{student.LastName}</TableCell>
                                    <TableCell>{student.age}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            onClick={() => setEditingStudent(student)}
                                            disabled={loading}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => handleDelete(student._id)}
                                            disabled={loading}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={students.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>

            {/* Notification d'erreur */}
            {error && (
                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    onClose={() => setError(null)}
                >
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
        </div>
    );
};

export default Etudiant;