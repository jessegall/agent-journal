from argparse import ArgumentParser

from core.base.environment_names import EnvironmentNames
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.git_rows import GitRows
from suites.coding.support.project_git import ProjectGit


PAGE_SIZE_ROWS = 30


class GitPageSubcommand(ReadSubcommand[GitRows]):
    """A read of the project's git history that pages through its rows."""

    cli_name = "git-overview"

    def __init__(self, git: ProjectGit, environment_names: EnvironmentNames) -> None:
        self.git, self.environment_names = git, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--skip", type=int, default=0)
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
