from features.base import Feature
from events.agents import AgentMessageSent, CommandRan
from engine.ran import DELIVERED
from expects import Given, Nudged, Unchanged
from features.chat_etiquette.details import REMIND, SHOP, THIRD_PERSON, ChatEtiquetteDetails
from features.chat_etiquette.handlers import NameShopTalk, NameThirdPerson, RemindOfEtiquette
from features.journal import Journal
from resources.types import AgentRow


class ChatEtiquette(Feature):
    details = ChatEtiquetteDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameShopTalk(), expects=[
            Given(AgentMessageSent(agent=1, text="Your message is answered, and I replied."), rows=[AgentRow(n=1)]) >> Nudged(SHOP, words="Your message is answered"),
            Given(AgentMessageSent(agent=1, text='You wrote "your message is answered" in the brief.'), rows=[AgentRow(n=1)]) >> Unchanged(),
            Given(AgentMessageSent(agent=1, text="The header is fixed and committed."), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])
        journal.events.handler(NameThirdPerson(), expects=[
            Given(AgentMessageSent(agent=1, text="The user asks for a faster build."), rows=[AgentRow(n=1)]) >> Nudged(THIRD_PERSON, words="The user asks"),
            Given(AgentMessageSent(agent=1, text='You said "the user asks" earlier.'), rows=[AgentRow(n=1)]) >> Unchanged(),
            Given(AgentMessageSent(agent=1, text="You asked for a faster build, so I made one."), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])
        journal.events.handler(RemindOfEtiquette(), expects=[
            Given(CommandRan(agent=1, tool=DELIVERED), rows=[AgentRow(n=1)]) >> Unchanged(),
            Given(CommandRan(agent=1, tool="Bash"), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])
