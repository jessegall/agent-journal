from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.agents.commands.record_menu_answer.record_menu_answer import RecordMenuAnswer
from core.modules.agents.models.menu_answer import MenuAnswer


class RecordMenuAnswerHandler(Handler[RecordMenuAnswer, MenuAnswer]):
    """Saves a menu's question and answer, for the listener that shows them in the chat."""

    command = RecordMenuAnswer

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordMenuAnswer, context: Context) -> MenuAnswer:
        return self.repository.save(MenuAnswer(session_agent_id=command.agent_id, creator_id=context.actor.id, question=command.question, answer=command.answer), context)
