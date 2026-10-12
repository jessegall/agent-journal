from controllers.types import Environments
from events.messages import MessageCreated
from expects import Given, Refused, Unchanged
from framework.base import Feature
from framework.journal import Journal
from resources.types import Message
from features.starting_agents.commands import Launch, no_such_agent
from features.starting_agents.details import StartingAgentsDetails
from features.starting_agents.handlers import WakeOnMessage


class StartingAgents(Feature):
    details = StartingAgentsDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("environment", Launch(), expects=[
            Given((Environments, 1, "bogus")) >> Refused(no_such_agent("bogus")),
        ])
        journal.events.handler(WakeOnMessage(), expects=[
            Given(MessageCreated(n=1, type="message"), rows=[Message(n=1, title="carry on", seen=["user"])], settings={"starting_agents.wake_on_message": False}) >> Unchanged(),
            Given(MessageCreated(n=1, type="message"), rows=[Message(n=1, title="a helper reported", seen=["agent"])]) >> Unchanged(),
            Given(MessageCreated(n=1, type="message"), rows=[Message(n=1, title="carry on", seen=["user"])]) >> Unchanged(),
        ])
