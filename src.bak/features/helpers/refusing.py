from events.asking import RowWriting
from receiving import Refuser
from resources.base import AGENT, Refused
from resources.types import Helper, Todo
from serving import ReadRows


def keep_with_its_helper(event: RowWriting, todos: ReadRows[Todo], helpers: ReadRows[Helper]) -> None:
    n = dict(event.fields).get("n")
    helper = helpers.handed_to(todos.peek(n))
    if helper is None:
        return
    raise Refused(f"todo {n} is handed to {helper.spoken}: only it marks it done, and taking its work closes it; "
                  f"to close, strike or reassign it yourself, journal helper stop {helper.n} gives it back first; "
                  f"journal helper say <helper> \"<text>\" --todos {n} moves it to another helper")


class HandedRowsCloseOnlyThroughTheirHelper(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, todos: ReadRows[Todo], helpers: ReadRows[Helper]) -> None:
        if event.type == "todo" and event.action == "complete" and event.actor == AGENT:
            keep_with_its_helper(event, todos, helpers)


class HandedRowsStayAssigned(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, todos: ReadRows[Todo], helpers: ReadRows[Helper]) -> None:
        if event.type == "todo" and event.action == "update" and event.actor == AGENT and {"assigned", "pending"} & dict(event.fields).keys():
            keep_with_its_helper(event, todos, helpers)
