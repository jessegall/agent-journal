from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.project_file_text import ProjectFileText
from suites.coding.support.project_files import ProjectFiles


class ProjectFileShowSubcommand(ReadSubcommand[ProjectFileText]):
    """`journal project-file show <path>`: the text of one file of the project."""

    cli_name = "project-file"
    name = "show"

    def __init__(self, files: ProjectFiles, environment_names: EnvironmentNames) -> None:
        self.files, self.environment_names = files, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("path")

    def read(self, arguments: Namespace, caller: Caller) -> ProjectFileText:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        return self.files.shown(environment_id, arguments.path)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ProjectFileText):
            output.write(value.text, value.json())
