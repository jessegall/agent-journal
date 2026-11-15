from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.question import Question
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from engine.enums.line_category import LineCategory
from core.modules.overview.nudges.overview_line_nudge import OverviewLineNudge
from core.modules.overview.support.overview_first import OverviewFirst


class OverviewFirstLines(LineSource):
    """Tells a main agent at a session start that is no resume to run journal overview first, in the words of today's line."""

    start_line = True
    events = [HookEventName.SESSION_START]
    category = LineCategory.STEERING

    def __init__(self, first: OverviewFirst) -> None:
        self.first = first

    def lines(self, question: Question, view: AgentView) -> Sequence[Line]:
        event = question.event
        if not self.first.is_required or event is None or event.is_resume or view.agent.agent_type != "main":
            return []
        nudge = OverviewLineNudge.declared().nudge()
        return [Line.of_nudge(nudge, LineCarrier.NOW, self.category)]
