from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from suites.coding.modules.workers.support.project_worktrees import ProjectWorktrees


class ProjectWorktreeListSubcommand(ReadSubcommand[RowList]):
    """`journal project-worktree list`: the worktrees of this repository, each with who holds it."""

    cli_name = "project-worktree"
    name = "list"

    def __init__(self, worktrees: ProjectWorktrees, environment_names: EnvironmentNames) -> None:
        self.worktrees, self.environment_names = worktrees, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        return RowList([worktree.row() for worktree in self.worktrees.listed(environment_id)])

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RowList):
            output.write("\n".join(f"{row['folder']} on {row['branch']}" for row in value.rows), value.json())
