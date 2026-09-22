import re

from engine.events import AgentMessageSent
from features.chat_etiquette.details import SHOP
from features.parts import AgentContext, Handler

SHOP_TALK = re.compile(r"\b(?:(?:your|the|this) message (?:is|was) (?:answered|processed|read|replied to)|I(?:'ve| have)? (?:replied|reacted|answered your message|processed (?:it|your message))"
                       r"|(?:filed|added) (?:it )?as a pill|marked (?:it|the message|your message) (?:as )?read|the journal (?:told|nudged|reminded|held) me)\b", re.IGNORECASE)


class NameShopTalk(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        found = SHOP_TALK.search(event.text)
        if found:
            context.agent.whisper(SHOP, words=found.group(0))
