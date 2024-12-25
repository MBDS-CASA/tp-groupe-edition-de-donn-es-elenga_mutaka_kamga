import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

function Note() {
  // Gestion des données avec récupération depuis localStorage
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [etudiants, setEtudiants] = useState(() => {
    const savedEtudiants = localStorage.getItem("etudiants");
    return savedEtudiants ? JSON.parse(savedEtudiants) : [];
  });

  const [cours, setCours] = useState(() => {
    const savedCours = localStorage.getItem("cours");
    return savedCours ? JSON.parse(savedCours) : [];
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Mise à jour automatique de localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addNote = (newNote) => {
    setNotes([...notes, { ...newNote, id: Date.now() }]);
  };

  const editNote = (updatedNote) => {
    const updatedNotes = notes.map((note, index) =>
      index === editIndex ? updatedNote : note
    );
    setNotes(updatedNotes);
    setEditOpen(false);
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div>
      <h1>Gestion des Notes</h1>
      <AddNote
        etudiants={etudiants}
        cours={cours}
        addNote={addNote}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Étudiant</TableCell>
              <TableCell>Cours</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((note, index) => (
                <TableRow key={note.id}>
                  <TableCell>{note.etudiant}</TableCell>
                  <TableCell>{note.cours}</TableCell>
                  <TableCell>{note.note}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => {
                        setEditIndex(index);
                        setEditOpen(true);
                      }}
                    >
                      Éditer
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => deleteNote(index)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={notes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {editIndex !== null && (
        <EditNote
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          note={notes[editIndex]}
          handleEdit={editNote}
        />
      )}
    </div>
  );
}

function AddNote({ etudiants, cours, addNote }) {
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const newNote = Object.fromEntries(formData.entries());
    if (!newNote.etudiant || !newNote.cours || !newNote.note) {
      alert("Tous les champs sont obligatoires.");
      return;
    }
    addNote(newNote);
    formRef.current.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="etudiant-label">Étudiant</InputLabel>
        <Select labelId="etudiant-label" name="etudiant" defaultValue="">
          {etudiants.map((etudiant) => (
            <MenuItem key={etudiant.id} value={etudiant.nom}>
              {etudiant.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="cours-label">Cours</InputLabel>
        <Select labelId="cours-label" name="cours" defaultValue="">
          {cours.map((cour) => (
            <MenuItem key={cour.id} value={cour.nom}>
              {cour.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Note"
        name="note"
        type="number"
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Ajouter
      </Button>
    </form>
  );
}

function EditNote({ open, handleClose, note, handleEdit }) {
  const formRef = useRef(null);

  const handleSubmit = () => {
    const formData = new FormData(formRef.current);
    const updatedNote = Object.fromEntries(formData.entries());
    handleEdit(updatedNote);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Modifier la note</DialogTitle>
      <DialogContent>
        <DialogContentText>Mettre à jour les informations.</DialogContentText>
        <form ref={formRef}>
          <TextField
            label="Étudiant"
            name="etudiant"
            defaultValue={note.etudiant}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cours"
            name="cours"
            defaultValue={note.cours}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Note"
            name="note"
            type="number"
            defaultValue={note.note}
            fullWidth
            margin="normal"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Note;
