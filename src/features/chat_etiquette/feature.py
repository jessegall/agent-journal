from framework.base import Feature
from events.agents import AgentMessageSent, CommandRan
from events.chat_etiquette import EtiquetteDue, ShopTalkInChat, ThickProseInChat, ThirdPersonInChat
from resources.runs import DELIVERED
from expects import Dispatches, Given, Nudged, nothing
from features.chat_etiquette.details import REMIND, SHOP, THIRD_PERSON, ChatEtiquetteDetails
from features.chat_etiquette.handlers import NameShopTalk, NameThickProse, NameThirdPerson, RemindOfEtiquette
from features.chat_etiquette.listeners import CountJournalLines, SpotShopTalk, SpotThickProse, SpotThirdPerson
from framework.journal import Journal
from resources.types import AgentRow

ADA = {"form_of_address.first_name": "Ada", "form_of_address.title": "Sir"}


def sent(text: str) -> AgentMessageSent:
    return AgentMessageSent(agent=1, text=text)


def shop(words: str) -> Dispatches:
    return Dispatches(ShopTalkInChat(agent=1, words=words))


class ChatEtiquette(Feature):
    details = ChatEtiquetteDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentMessageSent, SpotShopTalk(), expects=[
            Given(sent("Your message is answered, and I replied.")) >> shop("Your message is answered"),
            Given(sent("Released 2.85.18. A new message came in, so I'm reading it:")) >> shop("A new message came in"),
            Given(sent("You reacted to the test-suite result. Nothing else is waiting.")) >> shop("You reacted"),
            Given(sent("Message 4636 is answered. Continuing.")) >> shop("Message 4636 is answered"),
            Given(sent("The replies to messages 4749, 4750 went out, but they're still listed as waiting.")) >> shop("replies to messages 4749, 4750 went out"),
            Given(sent("Closing both explicitly:")) >> shop("Closing both explicitly"),
            Given(sent("Ik lees je bericht eerst.")) >> shop("Ik lees je bericht eerst"),
            Given(sent('The build is green; it now catches lines like "your message is answered".')) >> Dispatches(nothing),
            Given(sent("To-do 1013 trims the log; the reply hint is in the brief.")) >> Dispatches(nothing),
            Given(sent("plus journal-todos once to-do 1024 is done")) >> Dispatches(nothing),
            Given(sent("De pagina is klaar.")) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentMessageSent, SpotThickProse(), expects=[
            Given(sent("It is done \u2014 the build passes \u2014 and the release \u2014 tagged \u2014 is out.")) >> Dispatches(ThickProseInChat(agent=1, dashes=4).due("prose")),
            Given(sent("It is done. The build passes \u2014 the release is out.")) >> Dispatches(nothing),
        ])
        journal.events.handle(ThickProseInChat, NameThickProse(), expects=[
            Given(ThickProseInChat(agent=1, dashes=4), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged("prose", dashes=4),
        ])
        journal.events.listen(AgentMessageSent, SpotThirdPerson(), expects=[
            Given(sent("The user wants a shorter list.")) >> Dispatches(ThirdPersonInChat(agent=1, words="The user wants")),
            Given(sent("Sir Ada asks to shorten the description."), settings=ADA) >> Dispatches(ThirdPersonInChat(agent=1, words="Sir Ada asks")),
            Given(sent("Will do, Sir Ada: shortening it now."), settings=ADA) >> Dispatches(nothing),
            Given(sent('Your words were "Ada wants a list", so here it is.'), settings=ADA) >> Dispatches(nothing),
            Given(sent("You asked for a faster build, so I made one.")) >> Dispatches(nothing),
        ])
        journal.events.listen(CommandRan, CountJournalLines(), expects=[
            Given(CommandRan(agent=1, tool=DELIVERED)) >> Dispatches(EtiquetteDue(agent=1).due(REMIND)),
            Given(CommandRan(agent=1, tool="Bash")) >> Dispatches(nothing),
        ])
        journal.events.handle(ShopTalkInChat, NameShopTalk(), expects=[
            Given(ShopTalkInChat(agent=1, words="Your message is answered"), rows=[AgentRow(n=1)]) >> Nudged(SHOP, words="Your message is answered"),
        ])
        journal.events.handle(ThirdPersonInChat, NameThirdPerson(), expects=[
            Given(ThirdPersonInChat(agent=1, words="The user asks"), rows=[AgentRow(n=1)]) >> Nudged(THIRD_PERSON, words="The user asks"),
        ])
        journal.events.handle(EtiquetteDue, RemindOfEtiquette(), expects=[
            Given(EtiquetteDue(agent=1), rows=[AgentRow(n=1)]) >> Nudged(REMIND),
        ])
