from controllers.types import CONTROLLERS, Notifications
from features.base import Feature, event
from resources.base import AGENT, SYSTEM, USER
from resources.types import TYPES

WORDS = {"created": "create", "completed": "complete"}


class NotificationsFeature(Feature):
    name = "notifications"
    title_ = "Notifications"
    abstract_ = "Every act of the agent the user should hear of becomes a notification"
    help_ = "A type that does not notify the user makes none; the agent may write one itself to say a long piece of work landed."

    @event("*")
    def tell(self, event, record) -> None:
        kind = TYPES[event.type]
        if event.actor != AGENT or USER not in kind.notify or "seen" in event.data:
            return
        resource = CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n)
        word = kind.names.get(WORDS.get(event.action, ""), event.action)
        Notifications(record, actor=SYSTEM).create(f"{kind.title_} {event.n} {word}", abstract=resource.title[:200], about=event.ref, event=event.id)
