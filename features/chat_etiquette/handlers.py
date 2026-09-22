import re

from engine.events import AgentMessageSent
from features.chat_etiquette.details import SHOP
from features.parts import AgentContext, Handler

QUOTES = ('"', "“", "'")

SHOP_TALK = re.compile(r"\b(?:(?:your|the|this) message (?:is|was) (?:answered|processed|read|replied to)|I(?:'ve| have)? (?:replied|reacted|answered your message|processed (?:it|your message))"
                       r"|(?:filed|added) (?:it )?as a pill|marked (?:it|the message|your message) (?:as )?read|the journal (?:told|nudged|reminded|held|asked) me"
                       r"|(?:a |one |two |\d+ )?new messages? (?:came in|just came in|arrived|is in|are in)|(?:I'?m |I am )?reading (?:it|them|your message|the new message)(?: first| now)?"
                       r"|(?:loading|loaded) the \S+ skill|you reacted|thanks for the (?:reaction|\S+ reaction)"
                       r"|nothing (?:else )?(?:is |was )?(?:open|waiting|pending|waits)(?: on my side| for me| here)?"
                       r"|(?:still|nothing) (?:waiting|new yet|to report yet|yet)|(?:I'?m |I am )?still waiting)\b", re.IGNORECASE)


class NameShopTalk(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        found = next((m for m in SHOP_TALK.finditer(event.text) if event.text[max(0, m.start() - 1):m.start()] not in QUOTES), None)
        if found:
            context.agent.whisper(SHOP, words=found.group(0))
