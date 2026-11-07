from argparse import ArgumentParser

from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.support.git_rows import GitRows
from suites.coding.support.project_git import ProjectGit


PAGE_SIZE_ROWS = 30


class GitPageSubcommand(ReadSubcommand[GitRows]):
    """A read of the project's git history that pages through its rows."""

    cli_name = "git-overview"

    def __init__(self, git: ProjectGit) -> None:
        self.git = git

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--skip", type=int, default=0)
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
