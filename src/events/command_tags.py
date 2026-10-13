"""What the command tags feature recognises in a turn, and what came of running the command a tag stands for."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class MessageTagged(Fact):
    """A line of the agent's turn opened with a tag, with the journal command it stands for."""

    agent: int
    turn: str
    tag: str
    about: str
    command: str
    words: str
    withheld: bool
    """Whether the turn's words were kept out of the chat, so a refusal brings them back."""




@dataclass(frozen=True, kw_only=True)
class TagRefused(Fact):
    """The command a tag stands for was refused, and why."""

    agent: int
    turn: str
    tag: str
    about: str
    why: str


@dataclass(frozen=True, kw_only=True)
class TurnKeptBack(Fact):
    """A turn kept out of the chat for the row its tag writes, whose tag was refused: its words belong in the chat after all."""

    agent: int
    turn: str
    words: str


@dataclass(frozen=True, kw_only=True)
class TagHintDue(Fact):
    """The agent ran by hand a command a tag would have run, and the hint is due."""

    agent: int
    tag: str
    hint: str
