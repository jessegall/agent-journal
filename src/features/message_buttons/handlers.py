from engine.events import AnyEvent
from features.message_buttons.shaping import shaped
from features.parts import Context, Handler

WRITTEN = ("created", "updated")
BUTTONED = ("message", "doc", "report")


class DropUnknownButtons(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type not in BUTTONED or event.action not in WRITTEN:
            return
        rows = context.journal.of(event.type)
        given = (rows.load(event.n).data or {}).get("buttons")
        if given is None:
            return
        kept = shaped(context.record, given)
        if kept != given:
            rows.update(event.n, buttons=kept)
