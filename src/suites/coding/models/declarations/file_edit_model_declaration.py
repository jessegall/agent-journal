from engine.module.model_declaration import ModelDeclaration
from suites.coding.models.file_edit import FileEdit


class FileEditModelDeclaration(ModelDeclaration):
    """How the module declares FileEdit."""

    model = FileEdit
    excluded_subcommands = ["make", "edit"]
