import time

from controllers.types import Agents, Environments, Messages
from engine.events.resources import MessageCreated
from engine.sessions import Sessions
from features.parts import Context, Handler
from features.starting_agents.launch import launch
from providers import DRIVERS
from resources.base import SYSTEM, USER

LAUNCHING_FOR = 60.0


def last_conversation(record):
    rows = [row for row in Agents(record, actor=SYSTEM)._every()
            if row.data.get("event") and row.provider in DRIVERS and not row.subagent and not row.title.startswith(f"{row.provider}-")]
    return max(rows, key=lambda row: float(row.at), default=None)


class WakeOnMessage(Handler):
    def handle(self, context: Context, event: MessageCreated) -> None:
        if not context.settings.wake_on_message or Messages(context.record, actor=SYSTEM).load(event.n).seen[:1] != [USER]:
            return
        record = context.record
        if Sessions(record.root).holder(record.env):
            return
        environments = Environments(record, actor=SYSTEM)
        place = environments._titled(record.env)
        if place is None or time.time() - float(place.launched) < LAUNCHING_FOR:
            return
        last = last_conversation(record)
        if last is None:
            return
        launch(environments, place, last.provider, last.title)
