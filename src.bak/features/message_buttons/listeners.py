from events import Fact
from events.message_buttons import AnsweredInOwnWords, ButtonsUnrunnable
from events.resources import AnyEvent, ResourceCreated
from features.message_buttons.buttoned import BUTTONED, of_kind
from receiving import Listener
from resources.base import USER
from resources.buttons import unspent
from resources.types import Comment, Doc, Message, Report
from serving import ReadRows


class SpotUnrunnableButtons(Listener[AnyEvent]):
    def listen(self, event: AnyEvent, messages: ReadRows[Message], docs: ReadRows[Doc], reports: ReadRows[Report]) -> list[Fact]:
        if event.type not in BUTTONED or not event.written:
            return []
        rows = of_kind(event.type, messages, docs, reports)
        given = (rows.peek(event.n).data or {}).get("buttons")
        if given is None:
            return []
        kept = rows.shaped_buttons(given)
        return [ButtonsUnrunnable(type=event.type, n=event.n, kept=kept)] if kept != given else []


class SpotAnswerInOwnWords(Listener[ResourceCreated]):
    """The user answers a row that waits on its buttons by commenting on it in their own words."""

    def listen(self, event: ResourceCreated, comments: ReadRows[Comment], messages: ReadRows[Message], docs: ReadRows[Doc], reports: ReadRows[Report]) -> list[Fact]:
        if event.type != "comment" or event.actor != USER:
            return []
        comment = comments.peek(event.n)
        found = []
        for ref in comment.refs:
            kind, _, n = ref.partition(":")
            if kind not in BUTTONED or not n.isdigit():
                continue
            row = of_kind(kind, messages, docs, reports).peek(int(n))
            if unspent(row) and not row.data.get("answered_own"):
                found.append(AnsweredInOwnWords(type=kind, n=row.n, words=comment.brief or comment.title))
        return found
