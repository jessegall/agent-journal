"""The moments of the question resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent
from resources.prompt_answers import PromptAnswer


@dataclass(frozen=True)
class QuestionCreated(ResourceEvent):
    on: ClassVar[str] = "question.created"


@dataclass(frozen=True)
class QuestionUpdated(ResourceEvent):
    on: ClassVar[str] = "question.updated"


@dataclass(frozen=True)
class QuestionCompleted(ResourceEvent):
    on: ClassVar[str] = "question.completed"


@dataclass(frozen=True, kw_only=True)
class ProseOffersChoices(Fact):
    """The agent's last message offers the user choices in prose, where a question with options belongs."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class AskingSettled(Fact):
    """A question was asked, or the user wrote, so the agent is no longer held for offering choices in prose."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class AnswerGiven(Fact):
    """The user answered a question the agent is waiting on."""

    agent: int
    n: int
    answer: str
    ref: str


@dataclass(frozen=True, kw_only=True)
class AnswerOnScreen(Fact):
    """A question answered in the viewer is the one the agent stands at on its own screen, which only pressed keys can answer."""

    agent: int
    option: int
    text: str
    options: int

    @property
    def answer(self) -> PromptAnswer:
        return PromptAnswer(self.option, self.text, self.options)


@dataclass(frozen=True, kw_only=True)
class QuestionSettled(Fact):
    """The row a question was about is closed, so the question has nothing left to ask."""

    n: int
    why: str


@dataclass(frozen=True, kw_only=True)
class QuestionsToFile(Fact):
    """The agent put these questions to its provider's question tool, which the journal asks instead: each is a text, its options and the agent's pick, as JSON."""

    agent: int
    asked: str
