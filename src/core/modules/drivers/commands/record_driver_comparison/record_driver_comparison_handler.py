from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.record_driver_comparison.record_driver_comparison import RecordDriverComparison
from core.modules.drivers.models.driver_comparison import DriverComparison
from core.modules.drivers.models.driver_comparison_stack import DriverComparisonStack


class RecordDriverComparisonHandler(Handler[RecordDriverComparison, None]):
    """Saves the comparison row of one event and the agent's comparison stack after it, made on its first event."""

    command = RecordDriverComparison

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordDriverComparison, context: Context) -> None:
        self.repository.save(DriverComparison(session_agent_id=command.session_agent_id, slice_name=command.slice_name, event_text=command.event_text,
                                              old_answer=command.old_answer, new_answer=command.new_answer, hook_call_id=command.hook_call_id,
                                              is_replayable=command.is_replayable, difference_state=command.difference_state), context)
        stack = self.queries.query(DriverComparisonStack).filter(session_agent_id=command.session_agent_id).first()
        moved = DriverComparisonStack(session_agent_id=command.session_agent_id, frames=command.frames, stop_refusals=command.stop_refusals,
                                      tool_refusals=command.tool_refusals)
        if stack is None:
            self.repository.save(moved, context)
            return
        self.repository.save_change(stack, replace(stack, frames=command.frames, stop_refusals=command.stop_refusals, tool_refusals=command.tool_refusals), context)
