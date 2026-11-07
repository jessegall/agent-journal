from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from suites.coding.commands.project_file_show.project_file_show_subcommand import ProjectFileShowSubcommand
from suites.coding.models.file_edit import FileEdit
from suites.coding.support.project_file_text import ProjectFileText
from suites.coding.support.project_files import ProjectFiles


class FileEditFileSubcommand(ProjectFileShowSubcommand):
    """Reads the current text of the file named by an edit."""

    cli_name = "file-edit"
    name = "file"

    def __init__(self, files: ProjectFiles, queries: Queries) -> None:
        super().__init__(files)
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> ProjectFileText:
        edit = self.queries.query(FileEdit).find(arguments.id)
        return self.files.shown(edit.path)
