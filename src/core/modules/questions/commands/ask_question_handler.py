from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.questions.commands.ask_question import AskQuestion
from core.modules.questions.models.question import Question


class AskQuestionHandler(Handler[AskQuestion, Question]):
    """Opens the calling agent's question in its environment, the recommended option put first."""

    command = AskQuestion

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: AskQuestion, context: Context) -> Question:
        if context.environment_id is None:
            raise Refusal("a question needs an environment", "name it with --environment")
        if command.recommended and command.recommended not in command.options:
            raise Refusal(f"the recommended choice is not one of the options: {command.recommended}", "write it word for word as one of --options")
        choices = [command.recommended, *(option for option in command.options if option != command.recommended)] if command.recommended else list(command.options)
        return self.repository.save(Question(environment_id=context.environment_id, agent_id=context.actor.id, creator_id=context.actor.id,
                                             text=command.text, options=tuple(choices), recommended=command.recommended), context)
