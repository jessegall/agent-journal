from events import Fact
from events.dev_faults import OverdueTodoClosed, OverdueTodoFiled
from events.resources import ResourceCreated
from events.todos import TodoCompleted
from features.dev_faults.reports import OVER
from receiving import Listener
from resources.types import Todo
from serving import ReadRows


class SpotOverdueTodoFiled(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, todos: ReadRows[Todo]) -> list[Fact]:
        title = todos.load(event.n).title if event.type == "todo" else ""
        return [OverdueTodoFiled(title=title)] if OVER in title else []


class SpotOverdueTodoClosed(Listener[TodoCompleted]):
    def listen(self, event: TodoCompleted, todos: ReadRows[Todo]) -> list[Fact]:
        title = todos.load(event.n).title
        return [OverdueTodoClosed(title=title)] if OVER in title else []
