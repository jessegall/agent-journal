from engine.command.context import Context
from engine.event.created import Created
from engine.guard.guard import Guard
from core.modules.drivers.support.command_check import CommandCheck
from suites.coding.modules.workers.commands.ask_merge.ask_merge import AskMerge
from suites.coding.modules.workers.models.merge_ask import MergeAsk


class ProvedDeliveryGuard(Guard[Created[MergeAsk]]):
    """A merge ask's own write asks workers.proved-delivery at AskMerge's entry point, so the CLI, MCP and the hook
    refuse alike."""

    name = "workers.proved-delivery"

    def __init__(self, start_check: CommandCheck) -> None:
        self.start_check = start_check

    def check(self, event: Created[MergeAsk], context: Context) -> None:
        if self.start_check.answers(context):
            self.start_check.admit(AskMerge, context)
