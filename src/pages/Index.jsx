import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNotes, useAddNote, useUpdateNote, useDeleteNote } from "@/integrations/supabase/index.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupabaseAuth } from "@/integrations/supabase/auth.jsx";

const Index = () => {
  const { toast } = useToast();
  const { logout } = useSupabaseAuth();

  const { data: notes, isLoading, isError } = useNotes();
  const addNote = useAddNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [noteData, setNoteData] = useState({ title: "", content: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteData({ ...noteData, [name]: value });
  };

  const handleAddNote = () => {
    addNote.mutate(noteData, {
      onSuccess: () => {
        toast({ title: "Note added successfully!" });
        setNoteData({ title: "", content: "" });
        setIsModalOpen(false);
      },
      onError: () => {
        toast({ title: "Failed to add note.", variant: "destructive" });
      },
    });
  };

  const handleUpdateNote = () => {
    updateNote.mutate({ ...selectedNote, ...noteData }, {
      onSuccess: () => {
        toast({ title: "Note updated successfully!" });
        setNoteData({ title: "", content: "" });
        setIsModalOpen(false);
        setIsEditMode(false);
      },
      onError: () => {
        toast({ title: "Failed to update note.", variant: "destructive" });
      },
    });
  };

  const handleDeleteNote = (id) => {
    deleteNote.mutate(id, {
      onSuccess: () => {
        toast({ title: "Note deleted successfully!" });
      },
      onError: () => {
        toast({ title: "Failed to delete note.", variant: "destructive" });
      },
    });
  };

  const openAddModal = () => {
    setNoteData({ title: "", content: "" });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setSelectedNote(note);
    setNoteData({ title: note.title, content: note.content });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="mb-4" onClick={openAddModal}>Add Note</Button>
          <Button className="mb-4 ml-4" variant="destructive" onClick={logout}>Logout</Button>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error loading notes.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardHeader>
                    <CardTitle>{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{note.content}</p>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" onClick={() => openEditModal(note)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDeleteNote(note.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Note" : "Add Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={noteData.title} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Input id="content" name="content" value={noteData.content} onChange={handleInputChange} />
            </div>
            <Button className="w-full" onClick={isEditMode ? handleUpdateNote : handleAddNote}>
              {isEditMode ? "Update Note" : "Add Note"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;