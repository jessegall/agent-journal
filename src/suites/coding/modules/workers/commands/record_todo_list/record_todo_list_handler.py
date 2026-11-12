from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.modules.workers.commands.record_todo_list.record_todo_list import RecordTodoList
from suites.coding.modules.workers.models.todo_item import TodoItem

TODO_REASON = "a new todo list replaces every item of the old one"


class RecordTodoListHandler(Handler[RecordTodoList, int]):
    """Replaces the agent's to-do items with the list its program wrote, and gives back how many it holds."""

    command = RecordTodoList

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordTodoList, context: Context) -> int:
        for item in list(self.queries.query(TodoItem).filter(session_agent_id=command.agent_id).every_row(TODO_REASON)):
            self.repository.delete(item, context)
        for position, (text, state) in enumerate(command.items, start=1):
            self.repository.save(TodoItem(session_agent_id=command.agent_id, creator_id=context.actor.id, position=position, text=text, state=state), context)
        return len(command.items)
