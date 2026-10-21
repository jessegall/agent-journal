from journal.events.agent.stop import Stop
from journal.events.agent_listener import AgentListener
from journal.providers.providers import Providers
from journal.supervisor_link import SupervisorLink


class SupervisorUpgrade(AgentListener[Stop]):
    """A supervisor whose code on disk changed since it started, by an update, is restarted when its agent ends a turn, the agent resumed on its conversation, so no turn is cut off and no launch is needed."""

    def __init__(self, supervisor: SupervisorLink, providers: Providers) -> None:
        self.supervisor, self.providers = supervisor, providers

    def handle(self, event: Stop) -> None:
        if event.subagent or not self.supervisor.is_outdated(event.environment_id):
            return
        self.supervisor.restart_supervisor(event.environment_id, self.providers.lookup(event.provider).resume(event.session))
