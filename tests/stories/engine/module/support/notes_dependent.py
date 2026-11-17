from engine.module.module import Module


class NotesDependent(Module):
    name = "folder.dependent"
    requires_engine = ">=7,<8"
    dependencies = ["folder.notes"]
