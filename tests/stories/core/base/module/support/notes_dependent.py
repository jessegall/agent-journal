from core.base.module.module import Module


class NotesDependent(Module):
    name = "folder.dependent"
    requires_core = ">=5,<6"
    dependencies = ["folder.notes"]
