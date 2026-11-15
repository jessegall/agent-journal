from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.nudges.continued_session_nudge import ContinuedSessionNudge


class ContinuedSessionLines(EventLineSource):
    """A main agent started again from a session of an earlier run is told once, in the words version 4 used
    for a resumed conversation, that it is back in it and says so to the user, naming the session. The
    start hook is recorded as allowed, which is what shows the agent idle, though its last hook of that run
    may say it was working."""

    key = "drivers.continued-session"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return [ContinuedSessionNudge.declared().nudge(agent=self.numbers.number(AGENT_MODEL_NAME, agent_id))] if event.is_resume else []
