from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.project_file_rows import ProjectFileRows
from suites.coding.support.project_files import ProjectFiles


class ProjectFileGrepSubcommand(ReadSubcommand[ProjectFileRows]):
    """`journal project-file grep <words>`: the lines of the tracked text files of the project that hold
    the words, with their file and line number."""

    row_line = "{id}:{line}: {text}"
    empty_line = "nothing found"

    cli_name = "project-file"
    name = "grep"

    def __init__(self, files: ProjectFiles) -> None:
        self.files = files

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("words")

    def read(self, arguments: Namespace, caller: Caller) -> ProjectFileRows:
        return self.files.grepped(arguments.words)
