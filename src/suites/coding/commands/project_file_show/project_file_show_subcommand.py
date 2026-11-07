from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.project_file_text import ProjectFileText
from suites.coding.support.project_files import ProjectFiles


class ProjectFileShowSubcommand(ReadSubcommand[ProjectFileText]):
    """`journal project-file show <path>`: the text of one file of the project."""

    cli_name = "project-file"
    name = "show"

    def __init__(self, files: ProjectFiles) -> None:
        self.files = files

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("path")

    def read(self, arguments: Namespace, caller: Caller) -> ProjectFileText:
        return self.files.shown(arguments.path)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ProjectFileText):
            output.write(value.text, value.json())
