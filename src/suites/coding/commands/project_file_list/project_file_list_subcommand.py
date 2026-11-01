from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.project_file_rows import ProjectFileRows
from suites.coding.support.project_files import ProjectFiles


class ProjectFileListSubcommand(ReadSubcommand[ProjectFileRows]):
    """`journal project-file list [<folder>]`: the entries of a folder of the project, folders first."""

    cli_name = "project-file"
    name = "list"

    def __init__(self, files: ProjectFiles, environment_names: EnvironmentNames) -> None:
        self.files, self.environment_names = files, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("folder", nargs="?", default="")

    def read(self, arguments: Namespace, caller: Caller) -> ProjectFileRows:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        return self.files.listed(environment_id, arguments.folder)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ProjectFileRows):
            output.write("\n".join(str(row["id"]) for row in value.rows) or "nothing found", value.json())
