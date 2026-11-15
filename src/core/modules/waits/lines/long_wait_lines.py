from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.question import Question
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from engine.enums.line_category import LineCategory
from engine.query.queries import Queries
from engine.time.clock import Clock
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait
from core.modules.waits.nudges.wait_check_nudge import WaitCheckNudge

OPEN_WAITS_REASON = "the open waits of one agent, a few at most"
LONG_WAIT_RULE = "waits.long-wait"
LONG_WAIT_MINUTES = 10


class LongWaitLines(LineSource):
    """At the agent's minute step, each wait open for ten minutes or more tells it to check on what it waits
    for; the line waits for the agent's next line event."""

    events = [HookEventName.TICK]
    includes_steps = True
    replaced_rules = tuple([LONG_WAIT_RULE])
    carrier = LineCarrier.WAITING
    category = LineCategory.STEERING

    def __init__(self, queries: Queries, clock: Clock) -> None:
        self.queries, self.clock = queries, clock

    def lines(self, question: Question, view: AgentView) -> Sequence[Line]:
        return [Line(nudge.key, nudge.text, self.category, nudge.key, self.carrier) for nudge in self.nudges(view.agent.agent_id)]

    # a check line for each wait of the agent open ten minutes or more
    def nudges(self, agent_id: int) -> list[Nudge]:
        now = self.clock.timestamp()
        waits = self.queries.query(Wait).filter(session_agent_id=agent_id, state=WaitState.OPEN).every_row(OPEN_WAITS_REASON)
        return [WaitCheckNudge.declared().nudge(minutes=wait.opened_at.elapsed_minutes(now), wait=wait.id) for wait in waits
                if wait.opened_at.elapsed_minutes(now) >= LONG_WAIT_MINUTES]
