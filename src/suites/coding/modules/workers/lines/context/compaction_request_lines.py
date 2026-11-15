from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.record.line import Line
from engine.enums.line_carrier import LineCarrier
from engine.agent_machine.record.question import Question
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.effects.request_compaction_effect import RequestCompactionEffect
from suites.coding.modules.workers.needs.compaction_needs import COMPACTION_STOP_RULE
from suites.coding.modules.workers.nudges.context_compacted_nudge import ContextCompactedNudge
from suites.coding.modules.workers.types.worker import Worker


class CompactionRequestLines(LineSource):
    """Tells the agent its context passed the limit and is being compacted, at the stop that asks for it."""

    events = [HookEventName.STOP]
    agent_types = [AgentRole.MAIN, Worker.key]
    key = COMPACTION_STOP_RULE
    # no program carries a line on a stop, so it waits for the agent's next event
    carrier = LineCarrier.WAITING

    def __init__(self, effect: RequestCompactionEffect) -> None:
        self.effect = effect

    def lines(self, question: Question, view: AgentView) -> Sequence[Line]:
        return [Line.of_nudge(ContextCompactedNudge.declared().nudge(), self.carrier)] if self.effect.asks(view) else []
