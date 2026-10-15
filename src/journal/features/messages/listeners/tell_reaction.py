from journal.engine.nudger import Nudger
from journal.events.models.created import Created
from journal.features.listener import Listener
from journal.models.author import Author
from journal.models.link import Link
from journal.repositories.agents import Agents
from journal.repositories.reactions import REACTS, Reactions
from journal.supervisor_link import SupervisorLink


class TellReaction(Listener[Created]):
    """A face the user puts on a message is typed to the live agent: acted on when it asks for something, never answered or mentioned. It is heard on the link that puts the face on the message, which is the moment both exist."""

    def __init__(self, nudger: Nudger, agents: Agents, reactions: Reactions, supervisor: SupervisorLink) -> None:
        self.nudger, self.agents, self.reactions, self.supervisor = nudger, agents, reactions, supervisor

    def handle(self, event: Created) -> None:
        from journal.features.messages.feature import Messages as MessagesFeature
        link = event.model
        if not isinstance(link, Link) or link.kind != REACTS:
            return
        reaction = self.reactions.find(link.source.id)
        agent = self.agents.live(reaction.environment_id)
        if reaction.author != Author.USER or agent is None:
            return
        line = self.nudger.say(agent, MessagesFeature.REACTED.about(face=reaction.face, n=link.target.id))
        if line:
            self.supervisor.type(line)
