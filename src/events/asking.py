"""The four questions the engine must answer before it can go on, and the rule each one answers by.

A hook has to be told whether the tool call may run before the call runs. A turn's words have to be
settled before they reach the chat. A text has to be formatted before it is shown. A row has to be
let through before it is written. All four are answered by read-only answerers, synchronously, and
nothing about them writes until the fact that follows them ticks.
"""

from dataclasses import dataclass, field

from events.answers import Asked, FirstRefusalWins, KeepingWins, TextsCompose


@dataclass(frozen=True, kw_only=True)
class ToolCallAsked(Asked):
    """May this tool call run, and with what input. One refusal stops it, whatever the other answerers said."""

    reduces = FirstRefusalWins
    tool: str = ""
    input: str = ""
    session: str = ""
    cwd: str = ""
    """The folder the agent works in, which a relative path in the call is read against."""
    paths: tuple[str, ...] = ()
    subagent: bool = False


@dataclass(frozen=True, kw_only=True)
class AgentDispatching(Asked):
    """May this subagent be dispatched, as the provider read the call. One refusal stops it."""

    reduces = FirstRefusalWins
    session: str = ""
    subagent: bool = False
    kind: str = ""
    model: str = ""
    model_supported: bool = False
    models: tuple[str, ...] = ()
    """The models the provider offers a dispatch, empty when it cannot tell."""
    name_supported: bool = False
    description: str = ""
    task: str = ""
    prompt: str = ""
    read_only: bool = False


@dataclass(frozen=True, kw_only=True)
class AgentMessageSending(Asked):
    """What of this turn reaches the chat, or none of it. One answerer keeping it out wins, since the turn's words belong to the row its tag writes."""

    reduces = KeepingWins
    text: str = ""
    turn: str = ""
    session: str = ""


@dataclass(frozen=True, kw_only=True)
class TextFormatting(Asked):
    """How this text is shown. Nothing wins: every formatter reads what the one before it wrote."""

    reduces = TextsCompose
    text: str = ""
    surface: str = ""


@dataclass(frozen=True, kw_only=True)
class RowWriting(Asked):
    """A row about to be written on the funnel. One refusal raises before the write, because a hold after the fact is no hold."""

    reduces = FirstRefusalWins
    type: str = ""
    action: str = ""
    actor: str = ""
    fields: tuple[tuple[str, object], ...] = field(default_factory=tuple)
    session: str = ""
