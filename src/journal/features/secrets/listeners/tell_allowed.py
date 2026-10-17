from journal.engine.nudger import Nudger
from journal.events.models.updated import Updated
from journal.features.listener import Listener
from journal.models.actor_kind import ActorKind
from journal.models.secret import Secret
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class TellAllowed(Listener[Updated]):
    """The user let a secret go to a program: the live agent is told what it may now run."""

    def __init__(self, nudger: Nudger, agents: Agents, supervisor: SupervisorLink) -> None:
        self.nudger, self.agents, self.supervisor = nudger, agents, supervisor

    def handle(self, event: Updated) -> None:
        from journal.features.secrets.feature import Secrets
        secret, was = event.model, event.was
        if not isinstance(secret, Secret) or not isinstance(was, Secret) or event.by.kind != ActorKind.USER:
            return
        allowed = [p for p in secret.programs if p not in was.programs]
        agent = self.agents.live()
        if not allowed or agent is None:
            return
        line = self.nudger.say(agent, Secrets.ALLOWED.about(n=secret.id, title=secret.title, programs=", ".join(allowed)))
        if line:
            self.supervisor.type(agent.environment_id, line)
