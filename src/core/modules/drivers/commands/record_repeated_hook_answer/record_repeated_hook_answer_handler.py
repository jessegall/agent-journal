from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.record_repeated_hook_answer.record_repeated_hook_answer import RecordRepeatedHookAnswer
from core.modules.drivers.models.hook_call import HookCall


class RecordRepeatedHookAnswerHandler(Handler[RecordRepeatedHookAnswer, None]):
    """Writes the overriding refusal on the stored hook call."""

    command = RecordRepeatedHookAnswer

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordRepeatedHookAnswer, context: Context) -> None:
        call = self.queries.query(HookCall).every_environment("a stored hook call is found by its number").find(command.hook_call_id)
        self.repository.save(call.changed(repeated_answer=command.refusal), context)
