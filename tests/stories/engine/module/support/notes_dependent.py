from engine.module.module import Module


class NotesDependent(Module):
    name = "folder.dependent"
    requires_engine = ">=6,<7"
    dependencies = ["folder.notes"]
