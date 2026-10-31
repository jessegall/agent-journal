from dataclasses import dataclass

from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle

TEXT_LIMIT_CHARACTERS = 500
OPTION_LIMIT_CHARACTERS = 120


@dataclass(frozen=True, kw_only=True)
class Question(Model):
    """What an agent asks the user, with the options it offers and the one it recommends, until it is answered
    or closed."""

    model_name = "question"
    cli_name = "question"
    lifecycle = QuestionLifecycle

    environment_id: int
    agent_id: int
    creator_id: int
    text: str
    options: tuple[str, ...] = ()
    recommended: str = ""
    answer: str = ""
    state: QuestionState = QuestionState.OPEN

    def __post_init__(self) -> None:
        if not 1 <= len(self.text) <= TEXT_LIMIT_CHARACTERS:
            raise Refusal(f"a {self.cli_name}'s text is 1 to {TEXT_LIMIT_CHARACTERS} characters, not {len(self.text)}", "say it shorter")
        for option in self.options:
            if not 1 <= len(option) <= OPTION_LIMIT_CHARACTERS:
                raise Refusal(f"a {self.cli_name}'s option is 1 to {OPTION_LIMIT_CHARACTERS} characters, not {len(option)}: {option}", "say it shorter")
        if self.recommended and self.recommended not in self.options:
            raise Refusal(f"the recommended choice must be one of the options, word for word: {self.recommended}")

