import time

from engine.events import TurnStopped
from features.parts import AgentContext, Handler
from resources.base import USER

COMMITS = "close_from_commits"
OFFERED = "update-offered"
OFFER_EVERY = 3600
OFFER = "offer"


class OfferAnUpdate(Handler):
    def handle(self, context: AgentContext, event: TurnStopped) -> None:
        commit = context.record.cursor_text(COMMITS)
        seen, _, at = context.record.cursor_text(OFFERED).partition(" ")
        if not commit or commit == seen:
            return
        if not seen or time.time() - float(at or 0) < OFFER_EVERY or self._unread(context):
            context.record.set_cursor_text(OFFERED, f"{commit} {at or time.time()}")
            return
        context.record.set_cursor_text(OFFERED, f"{commit} {time.time()}")
        context.agent.say(OFFER)

    @staticmethod
    def _unread(context: AgentContext) -> bool:
        return any(r.data.get("kind") == "update" and not r.data.get("dismissed") and USER not in r.seen
                   for r in context.journal.reports._standing())
