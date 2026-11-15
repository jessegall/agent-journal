from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.nudges.introduction_nudge import IntroductionNudge


class IntroductionLines(EventLineSource):
    """A main session the journal started, from its launcher, is told to introduce itself in the chat."""

    key = "coding.introduction"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        if not event.launch:
            return []
        return [IntroductionNudge.declared().nudge()]
