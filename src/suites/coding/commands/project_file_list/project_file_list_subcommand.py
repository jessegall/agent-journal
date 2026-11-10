from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.project_file_rows import ProjectFileRows
from suites.coding.support.project_files import ProjectFiles


class ProjectFileListSubcommand(ReadSubcommand[ProjectFileRows]):
    """`journal project-file list [<folder>]`: the entries of a folder of the project, folders first."""

    row_line = "{id}"
    empty_line = "nothing found"

    cli_name = "project-file"
    name = "list"

    def __init__(self, files: ProjectFiles) -> None:
        self.files = files

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("folder", nargs="?", default="")

    def read(self, arguments: Namespace, caller: Caller) -> ProjectFileRows:
        return self.files.listed(arguments.folder)
