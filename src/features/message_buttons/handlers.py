from engine.events.resources import AnyEvent, ResourceCreated
from features.message_buttons.pressing import unspent
from features.message_buttons.shaping import shaped
from features.parts import Context, Handler
from controllers.types import CONTROLLERS, Comments
from resources.base import USER

BUTTONED = ("message", "doc", "report")


class DropUnknownButtons(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type not in BUTTONED or not event.written:
            return
        rows = context.journal.get(CONTROLLERS[event.type])
        given = (rows.load(event.n).data or {}).get("buttons")
        if given is None:
            return
        kept = shaped(context.record, given)
        if kept != given:
            rows.update(event.n, buttons=kept)


class AnswerInWords(Handler):
    """A comment the user writes on a row that waits on its buttons is the user's answer in their own words, so the row stops asking for one."""

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type != "comment" or event.actor != USER:
            return
        comment = context.journal.get(Comments).load(event.n)
        for ref in comment.refs:
            kind, _, n = ref.partition(":")
            if kind not in BUTTONED or not n.isdigit():
                continue
            rows = context.journal.get(CONTROLLERS[kind])
            row = rows.load(int(n))
            if unspent(row) and not row.data.get("answered_own"):
                rows.action("set")(row.n, key="answered_own", value=comment.brief or comment.title)
