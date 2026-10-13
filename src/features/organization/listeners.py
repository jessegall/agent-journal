from engine.organization import PLAN
from events import Fact
from events.organization import RoleAgentToStop, RoleTodoToStart
from events.todos import TodoCompleted
from receiving import Listener
from resources.types import Todo
from serving import ReadRows


class SpotRoleWorkToHandOn(Listener[TodoCompleted]):
    def listen(self, event: TodoCompleted, todos: ReadRows[Todo]) -> list[Fact]:
        todo = todos.peek(event.n)
        role = todos.role_of(todo)
        found = []
        if role:
            found += [RoleTodoToStart(environment=env, n=waiting.n, task=f"{waiting.title}\n{waiting.brief}", role=role.name, title=role.title,
                                   cardinality=role.cardinality, runs=role.runs)
                      for env, waiting in todos.next_in_line(todo.data["domain"], todo.data["role"], todo.n)]
        if todo.data.get("role_environment") and not (role and role.cardinality == PLAN):
            found.append(RoleAgentToStop(environment=todo.data["role_environment"]))
        return found
