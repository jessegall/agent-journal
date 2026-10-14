import re

from resources.runs import DELIVERED
from events import Fact
from events.agents import AgentMessageSent, CommandRan
from events.chat_etiquette import EtiquetteDue, ShopTalkInChat, ThickProseInChat, ThirdPersonInChat
from features.chat_etiquette.details import PROSE, REMIND
from receiving import Listener
from resources.form_of_address import Profile
from serving import ReadRows

QUOTES = ('"', "“", "'")
ABOUT_THEM = r"(?:asks|asked|wants|wanted|says|said|writes|wrote|would like|needs|prefers|is asking|has asked)"

SHOP_TALK = re.compile(r"\b(?:(?:your|the|this) message (?:is|was) (?:answered|processed|read|replied to)|I(?:'ve| have)? (?:replied|reacted|answered your message|processed (?:it|your message))"
                       r"|(?:filed|added) (?:it )?as a pill|marked (?:it|the message|your message) (?:as )?read|the journal (?:told|nudged|reminded|held|asked) me"
                       r"|(?:a |one |two |\d+ )?new messages? (?:came in|just came in|arrived|is in|are in)|(?:I'?m |I am )?reading (?:it|them|your message|the new message)(?: first| now)?"
                       r"|(?:loading|loaded) the \S+ skill|you reacted|thanks for the (?:reaction|\S+ reaction)"
                       r"|nothing (?:else )?(?:is |was )?(?:open|waiting|pending|waits)(?: on my side| for me| here)?"
                       r"|(?:^|(?<=[.!?]\s))(?:still waiting|nothing new yet|nothing to report yet|nothing yet)|I'?m still waiting|I am still waiting"
                       r"|(?<!once )(?<!when )(?<!until )(?<!after )(?<!before )(?:message|to-do|todo|question|comment)s? \d+(?:(?:,| and|, and) \d+)* (?:is|was|are|were) (?:already )?(?:answered|processed|read|filed|closed|done|replied to)"
                       r"|repl(?:y|ies) (?:to [^.]{0,40})?went out|(?:still )?listed as (?:waiting|unread|unanswered|open)"
                       r"|closing (?:both|them|it) explicitly|still (?:unread|unanswered)"
                       r"|(?:je|jouw|het|dit) bericht is (?:beantwoord|verwerkt|gelezen)|ik heb (?:gereageerd|geantwoord|je bericht verwerkt)|(?:het|de) journal (?:zei|herinnerde|vroeg|hield) me"
                       r"|(?:een |één |twee |\d+ )?nieuwe? berichte?n? (?:is |zijn )?(?:binnengekomen|binnen)|ik lees (?:het|ze|je bericht) (?:eerst|nu)"
                       r"|(?:de )?\S+ skill (?:geladen|laden)|je reageerde|niets (?:meer )?(?:staat )?open|er wacht niets|ik wacht nog|nog niets te melden"
                       r"|(?:bericht|to-do|vraag|opmerking)(?:en)? \d+ (?:is|zijn) (?:al )?(?:beantwoord|verwerkt|gelezen|gesloten|afgerond)|staat nog (?:als )?(?:open|ongelezen|onbeantwoord))\b",
                       re.IGNORECASE | re.MULTILINE)


def unquoted(pattern: re.Pattern, text: str) -> list[str]:
    """The first match of the pattern that is not a quotation, as the one word list a fact carries, or none."""
    return [m.group(0) for m in pattern.finditer(text) if text[max(0, m.start() - 1):m.start()] not in QUOTES][:1]


def third_person(profiles) -> re.Pattern:
    names = sorted({name for name in (profiles.user_called(), profiles.user_first_name(), "the user") if name}, key=len, reverse=True)
    return re.compile(rf"\b(?:{'|'.join(map(re.escape, names))})\s+{ABOUT_THEM}\b", re.IGNORECASE)


class SpotShopTalk(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent) -> list[Fact]:
        return [ShopTalkInChat(agent=event.agent, words=words) for words in unquoted(SHOP_TALK, event.text)]


class SpotThirdPerson(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent, profiles: ReadRows[Profile]) -> list[Fact]:
        return [ThirdPersonInChat(agent=event.agent, words=words) for words in unquoted(third_person(profiles), event.text)]


class CountJournalLines(Listener[CommandRan]):
    def listen(self, event: CommandRan) -> list[Fact]:
        return [EtiquetteDue(agent=event.agent).due(REMIND)] if event.tool == DELIVERED else []


# a person typing at a keyboard almost never writes an em dash, so a turn with this many is agent prose
THICK = 3


class SpotThickProse(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent) -> list[Fact]:
        dashes = event.text.count("\u2014")
        return [ThickProseInChat(agent=event.agent, dashes=dashes).due(PROSE)] if dashes >= THICK else []
