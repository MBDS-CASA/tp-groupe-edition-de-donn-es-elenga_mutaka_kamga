import { Route, Routes } from "react-router";
import Etudiant from "../Component/Etudiant";
import Matiere from "../Component/Matiere";
import Note from "../Component/Note";
import Home from "../Component/Home";
import Index from "../views/Index";

export default function AppRoute() {
    return (
        <Routes>
            <Route path="/index" element={<Index />}></Route>
            <Route path="/students" element={<Etudiant />}></Route>
            <Route path="/cours" element={<Matiere />}></Route>
            <Route path="/note" element={<Note />}></Route>
            <Route path="/" element={<Index />}></Route>
        </Routes>
    )
}