import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TablePagination, Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, MenuItem, Select, InputLabel, FormControl 
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';

function Note() {
  const [studentData, setStudentData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editIndex, setEditIndex] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const formRef = useRef(null);

  // Functions to manage localStorage
  const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  useEffect(() => {
    setStudentData(loadFromLocalStorage('etudiants'));
    setSubjectData(loadFromLocalStorage('matieres'));
    setNotes(loadFromLocalStorage('notes'));
  }, []);

  useEffect(() => {
    saveToLocalStorage('notes', notes);
  }, [notes]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addNote = (newNote) => {
    setNotes([...notes, { ...newNote, id: Date.now() }]); // Adding unique ID
  };

  const handleEditOpen = (index) => {
    setEditIndex(index);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const editNote = (updatedNote) => {
    const updatedData = notes.map((note, i) => 
      i === editIndex ? { ...updatedNote, id: notes[i].id } : note
    );
    setNotes(updatedData);
    handleEditClose();
  };

  const deleteNote = (index) => {
    const updatedData = notes.filter((_, i) => i !== index);
    setNotes(updatedData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const newNote = Object.fromEntries(formData.entries());

    if (!newNote.etudiant || !newNote.cours || !newNote.note) {
      alert('Tous les champs doivent être remplis.');
      return;
    }
    if (isNaN(newNote.note) || newNote.note < 0 || newNote.note > 20) {
      alert('La note doit être un nombre entre 0 et 20.');
      return;
    }

    addNote(newNote);
    formRef.current.reset();
  };

  return (
    <>
      <h1>Gérer les notes</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="etudiant-label">Étudiant</InputLabel>
          <Select labelId="etudiant-label" id="etudiant" name="etudiant" defaultValue="">
            {studentData.map((student) => (
              <MenuItem key={student.id} value={student.nom}>{student.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="matiere-label">Matière</InputLabel>
          <Select labelId="matiere-label" id="cours" name="cours" defaultValue="">
            {subjectData.map((subject) => (
              <MenuItem key={subject.id} value={subject.matiere}>{subject.matiere}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Note" id="note" name="note" type="number" fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Ajouter</Button>
      </form>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="student grades table">
          <TableHead>
            <TableRow>
              <TableCell>ETUDIANT</TableCell>
              <TableCell align="center">Cours</TableCell>
              <TableCell align="right">Note</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.etudiant}</TableCell>
                <TableCell align="center">{item.cours}</TableCell>
                <TableCell align="right">{item.note}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="secondary" onClick={() => deleteNote(index)}>Supprimer</Button>
                  <Button variant="contained" color="primary" onClick={() => handleEditOpen(index)}>Éditer</Button>
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
          handleClose={handleEditClose}
          note={notes[editIndex]}
          handleEdit={editNote}
        />
      )}
    </>
  );
}

function EditNote ({ open, handleClose, note, handleEdit }) {
  const formRef = useRef(null);

  const handleSubmit = () => {
    const formData = new FormData(formRef.current);
    const updatedNote = Object.fromEntries(formData.entries());

    if (!updatedNote.etudiant || !updatedNote.cours || !updatedNote.note) {
      alert('Tous les champs doivent être remplis.');
      return;
    }
    if (isNaN(updatedNote.note) || updatedNote.note < 0 || updatedNote.note > 20) {
      alert('La note doit être un nombre entre 0 et 20.');
      return;
    }

    handleEdit(updatedNote);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Éditer note</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modifier les informations de la note.
        </DialogContentText>
        <form ref={formRef}>
          <TextField label="Étudiant" id="etudiant" name="etudiant" defaultValue={note.etudiant} fullWidth margin="normal" />
          <TextField label="Cours" id="cours" name="cours" defaultValue={note.cours} fullWidth margin="normal" />
          <TextField label="Note" id="note" name="note" type="number" defaultValue={note.note} fullWidth margin="normal" />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Note;
