from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from suites.coding.modules.workers.commands.record_todo_list import RecordTodoList
from suites.coding.modules.workers.models.todo_item import TodoItem


class RecordTodoListHandler(Handler[RecordTodoList, int]):
    """Replaces the agent's to-do items with the list its program wrote, and gives back how many it holds."""

    command = RecordTodoList

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordTodoList, context: Context) -> int:
        for item in list(self.queries.query(TodoItem).filter(agent_id=command.agent_id).all_rows()):
            self.repository.delete(item, context)
        for position, (text, state) in enumerate(command.items, start=1):
            self.repository.save(TodoItem(agent_id=command.agent_id, creator_id=context.actor.id, position=position, text=text, state=state), context)
        return len(command.items)
