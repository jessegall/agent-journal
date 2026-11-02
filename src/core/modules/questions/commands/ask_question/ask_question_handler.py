from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.questions.commands.ask_question.ask_question import AskQuestion
from core.modules.waits.commands.open_wait.open_wait import OpenWait
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.questions.models.question import OPTION_LIMIT_CHARACTERS, TEXT_LIMIT_CHARACTERS, Question


class AskQuestionHandler(Handler[AskQuestion, Question]):
    """Opens the calling agent's question in its environment, the recommended option put first, and the wait
    on it."""

    command = AskQuestion

    def __init__(self, bus: Bus, repository: Repository) -> None:
        self.bus, self.repository = bus, repository

    def handle(self, command: AskQuestion, context: Context) -> Question:
        if context.environment_id is None:
            raise Refusal("a question needs an environment", "name it with --environment")
        if not 1 <= len(command.text) <= TEXT_LIMIT_CHARACTERS:
            raise Refusal(f"a question's text is 1 to {TEXT_LIMIT_CHARACTERS} characters, not {len(command.text)}", "say it shorter")
        for option in command.options:
            if not 1 <= len(option) <= OPTION_LIMIT_CHARACTERS:
                raise Refusal(f"a question's option is 1 to {OPTION_LIMIT_CHARACTERS} characters, not {len(option)}: {option}", "say it shorter")
        if command.recommended and command.recommended not in command.options:
            raise Refusal(f"the recommended choice is not one of the options: {command.recommended}", "write it word for word as one of --options")
        choices = [command.recommended, *(option for option in command.options if option != command.recommended)] if command.recommended else list(command.options)
        question = self.repository.save(Question(environment_id=context.environment_id, agent_id=context.actor.id, creator_id=context.actor.id,
                                             text=command.text, options=tuple(choices), recommended=command.recommended), context)
        wait = OpenWait(WaitType.ROWS, question.text, [f"questions:{question.id}"])
        self.bus.dispatch(wait, context.nested(wait))
        return question
