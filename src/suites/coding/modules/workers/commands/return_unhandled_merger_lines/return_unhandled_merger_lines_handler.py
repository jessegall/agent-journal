from engine.command.context import Context
from engine.command.handler import Handler
from suites.coding.modules.workers.commands.return_unhandled_merger_lines.return_unhandled_merger_lines import ReturnUnhandledMergerLines
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class ReturnUnhandledMergerLinesHandler(Handler[ReturnUnhandledMergerLines, None]):
    """Makes the lines an ended merger read and did nothing about unread again."""

    command = ReturnUnhandledMergerLines

    def __init__(self, visits: MergerVisits) -> None:
        self.visits = visits

    def handle(self, command: ReturnUnhandledMergerLines, context: Context) -> None:
        self.visits.return_unhandled_lines(context)
