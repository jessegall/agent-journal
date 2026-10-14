from events.asking import RowWriting
from receiving import Refuser
from resources.base import Refused
from resources.types import Plan, Todo
from serving import ReadRows


class HoldWhilePlanned(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, plans: ReadRows[Plan], todos: ReadRows[Todo]) -> None:
        if event.type != "work" or event.action != "open":
            return
        todo = dict(event.fields).get("todo") or 0
        if todo and plans.holds(todos.peek(todo)):
            raise Refused(f"todo {todo} is not in the active plan's current phase: finish the plan, raise it to critical, or --force \"<why>\"")
        if not todo and plans.running():
            raise Refused("a plan is active: open work for a row of its current phase with journal todo start <n>, or --force \"<why>\"")
