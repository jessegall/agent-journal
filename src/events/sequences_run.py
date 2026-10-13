"""What the sequences feature recognises: a sequence to start, a step to hand the agent and what becomes of it."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class SequenceStarts(Fact):
    """A sequence whose start rule the moment meets, with the row the run is about."""

    sequence: int
    about: str


@dataclass(frozen=True, kw_only=True)
class RunEnded(Fact):
    """The row a run was about is gone, so the run goes with it."""

    sequence: int
    key: str


@dataclass(frozen=True, kw_only=True)
class StepHeld(Fact):
    """A step handed to the agent and not yet taken up, which holds its writes."""

    agent: int
    sequence: int
    title: str
    step: int
    about: str


@dataclass(frozen=True, kw_only=True)
class StepToSay(Fact):
    """A step to tell the agent, with everything its line fills in."""

    agent: int
    values: dict


@dataclass(frozen=True, kw_only=True)
class StepTakenUp(Fact):
    """No step stands in the agent's way: the hold on its writes is let go."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class DispatchDue(Fact):
    """A dispatch sequence's run is to be told to the agent, who is lent the environment to dispatch in."""

    agent: int
    session: str
    env: str
    sequence: int
    title: str
    kind: str
    about: str
    board: int
    model: str
    why: str
    request: str


@dataclass(frozen=True, kw_only=True)
class StepEdited(Fact):
    """A write the agent made while a step it took up stands, with how many it has made."""

    agent: int
    edits: int


@dataclass(frozen=True, kw_only=True)
class StepStalled(Fact):
    """A step taken up that has stood through more writes than the setting allows."""

    agent: int
    sequence: int
    title: str
    step: int
    edits: int
    about: str


@dataclass(frozen=True, kw_only=True)
class StepCountRestarted(Fact):
    """A sequence moved, so the writes a step is allowed are counted afresh."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class TalkKeptOut(Fact):
    """A turn the agent wrote while a sequence holds the chat for the place the user is in."""

    agent: int
    title: str
    place: str


@dataclass(frozen=True, kw_only=True)
class StepFollowed(Fact):
    """A write that does only what the step names, which takes the step up."""

    sequence: int
    about: str | None
