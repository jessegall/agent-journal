from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.remove_project_worktree.remove_project_worktree import RemoveProjectWorktree


class RemoveProjectWorktreeSubcommand(Subcommand[RemoveProjectWorktree, str]):
    """`journal project-worktree remove <folder>`: removes a worktree folder nobody is working in, keeping its
    branch."""

    cli_name = "project-worktree"
    name = "remove"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("folder")

    def command(self, arguments: Namespace, caller: Caller) -> RemoveProjectWorktree:
        return RemoveProjectWorktree(arguments.folder)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, str):
            output.write(f"removed {value}; its branch stays", {"folder": value})
