from v2.controllers.types import CONTROLLERS
from v2.features.base import Feature, on
from v2.resources.base import AGENT, SYSTEM, USER
from v2.resources.types import TYPES

WORDS = {"created": "create", "completed": "complete"}


class Notifications(Feature):
    name = "notifications"
    title_ = "Notifications"
    abstract_ = "Every act of the agent the user should hear of becomes a notification"
    help_ = "A type that does not notify the user makes none; the agent may write one itself to say a long piece of work landed."

    @on("*")
    def tell(self, event, record) -> None:
        kind = TYPES[event.type]
        if event.actor != AGENT or USER not in kind.notify:
            return
        resource = CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n)
        word = kind.names.get(WORDS.get(event.action, ""), event.action)
        CONTROLLERS["notification"](record, actor=SYSTEM).create(f"{kind.title_} {event.n} {word}", abstract=resource.title[:200], about=event.ref, event=event.id)
