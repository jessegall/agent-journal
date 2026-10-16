from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.models.created import Created
from journal.features.listener import Listener
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.repositories.counts import Counts
from journal.supervisor_link import SupervisorLink


class DeliverMessage(Listener[Created]):
    """A message the user leaves is typed into the live agent's terminal by number, and its counts of tool uses and inbox namings start again: the engine's own delivery, not a workflow."""

    def __init__(self, agents: Agents, machine: Machine, nudger: Nudger, supervisor: SupervisorLink, counts: Counts) -> None:
        self.agents, self.machine, self.nudger, self.supervisor, self.counts = agents, machine, nudger, supervisor, counts

    def handle(self, event: Created) -> None:
        from journal.features.messages.feature import Messages
        message = event.model
        if not isinstance(message, Message) or message.author != Author.USER:
            return
        agent = self.agents.live()
        if agent is None:
            return
        line = self.nudger.say(agent, Messages.NEW.about(n=message.id))
        if line:
            self.supervisor.type(message.environment_id, line)
        for name in ("uses", "namings"):
            self.counts.set(agent.session, name, 0, Actor.system())
