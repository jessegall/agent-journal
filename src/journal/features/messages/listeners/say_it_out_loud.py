from journal.config import Config
from journal.engine.nudger import Nudger
from journal.events.agent.idle import Idle
from journal.features.agent_listener import AgentListener
from journal.features.messages.listeners.record_turn import REPLY_TAG
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages
from journal.supervisor_link import SupervisorLink


class SayItOutLoud(AgentListener[Idle]):
    """A reply written in the agent's thinking never reaches the chat: when the turn ends with such a reply and the message still unanswered, the agent is told to say it out loud."""

    def __init__(self, config: Config, providers: Providers, messages: Messages, agents: Agents, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.config, self.providers, self.messages, self.agents, self.nudger, self.supervisor = config, providers, messages, agents, nudger, supervisor

    def handle(self, event: Idle) -> None:
        from journal.features.messages.feature import Messages as MessagesFeature
        thoughts = self.providers.named(event.provider).thoughts_this_turn(self.config.root, event.session)
        replied_in_thought = {int(n) for thought in thoughts for tag in REPLY_TAG.finditer(thought) for n in tag.group(1).split(",")}
        unanswered = {m.id for m in self.messages.unanswered(event.environment_id)}
        lost = sorted(replied_in_thought & unanswered)
        live = self.agents.live(event.environment_id)
        if lost and live:
            line = self.nudger.say(live, MessagesFeature.SAY_IT.about(numbers=", ".join(map(str, lost))))
            if line:
                self.supervisor.type(event.environment_id, line)
