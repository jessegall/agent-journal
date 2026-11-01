from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.git_rows import GitRows
from suites.coding.support.project_git import ProjectGit


class GitOverviewCommitsSubcommand(ReadSubcommand[GitRows]):
    """`journal git-overview commits`: the recent commits of the current branch."""

    cli_name = "git-overview"
    name = "commits"

    def __init__(self, git: ProjectGit, environment_names: EnvironmentNames) -> None:
        self.git, self.environment_names = git, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--skip", type=int, default=0)
        parser.add_argument("--limit", type=int, default=30)

    def read(self, arguments: Namespace, caller: Caller) -> GitRows:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        return self.git.commits(environment_id, arguments.skip, arguments.limit)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, GitRows):
            output.write("\n".join(str(row["subject"]) for row in value.rows) or "no commits", value.json())
