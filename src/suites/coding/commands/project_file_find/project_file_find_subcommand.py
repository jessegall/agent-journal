from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.project_file_rows import ProjectFileRows
from suites.coding.support.project_files import ProjectFiles


class ProjectFileFindSubcommand(ReadSubcommand[ProjectFileRows]):
    """`journal project-file find <words>`: the tracked files of the project whose path holds the words."""

    row_line = "{id}"
    empty_line = "nothing found"

    cli_name = "project-file"
    name = "find"

    def __init__(self, files: ProjectFiles) -> None:
        self.files = files

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("words")

    def read(self, arguments: Namespace, caller: Caller) -> ProjectFileRows:
        return self.files.found(arguments.words)
