from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.turn_failed import TurnFailed


class UsageConduct(Conduct):
    """The usage feature's conduct in every state: a turn the provider refused on the usage limit pushes UsageLimited over whatever the agent was doing."""

    def on_turn_failed(self, event: TurnFailed, settings: Settings) -> Transition:
        from journal.features.usage.states.usage_limited import UsageLimited
        return self.push(UsageLimited(limited_at=event.time, message=event.message)) if event.is_usage_limit() else self.none()
