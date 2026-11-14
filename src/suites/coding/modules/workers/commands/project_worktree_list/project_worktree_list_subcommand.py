from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.scope.environment_scope import EnvironmentScope
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.row_list import RowList
from suites.coding.modules.workers.support.project_worktrees import ProjectWorktrees


class ProjectWorktreeListSubcommand(ReadSubcommand[RowList]):
    """`journal project-worktree list`: the worktrees of this repository, each with who holds it."""

    cli_name = "project-worktree"
    name = "list"
    disabled_scopes = [EnvironmentScope]

    def __init__(self, worktrees: ProjectWorktrees) -> None:
        self.worktrees = worktrees

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        environment_id = caller.environment_id
        return RowList([worktree.row() for worktree in self.worktrees.listed(environment_id)])

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RowList):
            output.write("\n".join(f"{row['folder']} on {row['branch']}" for row in value.rows), value.json())
