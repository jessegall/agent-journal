from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.ticked import Ticked
from journal.features.agent_listener import AgentListener
from journal.features.chart.context import Context
from journal.features.chart.walk import Walk
from journal.hooks.decision import Decision


class WalkAgentEvents(AgentListener[AgentEvent]):
    """Every agent event walks the chart before the hook is answered, so a hold or a blocked stop reaches the agent; a line said rides on the answer."""

    blocking = True

    def __init__(self, walk: Walk) -> None:
        self.walk = walk

    def handle(self, event: AgentEvent) -> Decision | None:
        decision = self.walk.on(Context(event=event, session=event.session, environment_id=event.environment_id, provider=event.provider or "claude", answers_hook=not isinstance(event, Ticked)))
        return decision if not decision.allowed or decision.context else None
