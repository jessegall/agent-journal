from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.project_git import ProjectGit


class GitOverviewCurrentSubcommand(ReadSubcommand[str]):
    """`journal git-overview current`: the branch the environment's checkout is on."""

    cli_name = "git-overview"
    name = "current"

    def __init__(self, git: ProjectGit, environment_names: EnvironmentNames) -> None:
        self.git, self.environment_names = git, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> str:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        return self.git.git_output(environment_id, "branch", "--show-current").strip()

    def write_output(self, value: object, output: Output) -> None:
        output.write(str(value), {"branch": value})
