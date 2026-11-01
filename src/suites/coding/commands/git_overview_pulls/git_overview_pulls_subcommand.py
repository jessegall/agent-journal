from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.git_pull_rows import GitPullRows
from suites.coding.support.project_git import ProjectGit


class GitOverviewPullsSubcommand(ReadSubcommand[GitPullRows]):
    """`journal git-overview pulls`: the open pull requests, read through the gh program."""

    cli_name = "git-overview"
    name = "pulls"

    def __init__(self, git: ProjectGit, environment_names: EnvironmentNames) -> None:
        self.git, self.environment_names = git, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")


    def read(self, arguments: Namespace, caller: Caller) -> GitPullRows:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        return self.git.pulls(environment_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, GitPullRows):
            output.write("\n".join(str(row["title"]) for row in value.rows) or "no open pull requests", value.json())
