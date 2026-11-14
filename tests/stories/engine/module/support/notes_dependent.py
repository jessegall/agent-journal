from engine.module.module import Module


class NotesDependent(Module):
    name = "folder.dependent"
    requires_engine = ">=5,<6"
    dependencies = ["folder.notes"]
