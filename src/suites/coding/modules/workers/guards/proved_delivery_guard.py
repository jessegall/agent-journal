from engine.command.context import Context
from engine.event.created import Created
from engine.guard.guard import Guard
from core.modules.drivers.support.command_check import CommandCheck
from suites.coding.modules.workers.commands.ask_merge.ask_merge import AskMerge
from suites.coding.modules.workers.models.merge_ask import MergeAsk


class ProvedDeliveryGuard(Guard[Created[MergeAsk]]):
    """A merge ask's own write asks workers.proved-delivery at AskMerge's entrance, so the CLI, MCP and the hook
    refuse alike."""

    name = "workers.proved-delivery"

    def __init__(self, admission: CommandCheck) -> None:
        self.admission = admission

    def check(self, event: Created[MergeAsk], context: Context) -> None:
        if self.admission.answers(context):
            self.admission.admit(AskMerge, context)
