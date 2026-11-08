from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.modules.workers.support.injection_list import InjectionList
from suites.coding.modules.workers.support.worker_instruction_files import WorkerInstructionFiles


class ListInjectionsSubcommand(ReadSubcommand[InjectionList]):
    """`journal worker injections <profile>`: the blocks a profile can have in the instruction files of its worker's
    worktree, the journal's own and each plugin's, and which ones the profile has on."""

    cli_name = "worker"
    name = "injections"
    row_line = "{key}: {title}: {state}"
    empty_line = "no injections"

    def __init__(self, files: WorkerInstructionFiles) -> None:
        self.files = files

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("profile")

    def read(self, arguments: Namespace, caller: Caller) -> InjectionList:
        profile = self.files.profile(arguments.profile)
        if profile is None:
            raise Refusal(f"no profile is named {arguments.profile}", "journal profile list shows the profiles")
        return InjectionList(profile.name, self.files.injections(profile))
