"""The four questions the engine must answer before it can go on, and the rule each one answers by.

A hook has to be told whether the tool call may run before the call runs. A turn's words have to be
settled before they reach the chat. A text has to be formatted before it is shown. A row has to be
let through before it is written. All four are answered by read-only answerers, synchronously, and
nothing about them writes until the fact that follows them ticks.
"""

from dataclasses import dataclass, field, replace

from events.answers import Asked, FirstRefusalWins, KeepingWins, TextsCompose, TextsJoin


@dataclass(frozen=True, kw_only=True)
class ToolCallAsked(Asked):
    """May this tool call run, and with what input. One refusal stops it, whatever the other answerers said."""

    reduces = FirstRefusalWins
    tool: str = ""
    input: str = ""
    command: str = ""
    """The shell command the call runs, whatever the provider names its shell tool; empty for a call that runs none."""
    session: str = ""
    cwd: str = ""
    """The folder the agent works in, which a relative path in the call is read against."""
    paths: tuple[str, ...] = ()
    writings: tuple[str, ...] = ()
    """What the call writes in its own words, such as an edit's new text or a dispatch's prompt; never a path it names."""
    subagent: bool = False
    writes: bool = False
    """Whether the call changes files in the project, as a hold on writes judges it."""
    background: bool = False
    """Whether the call asked to run in the background, which a wait in the shell is then no reason to refuse."""


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
class LongCommandMoving(Asked):
    """May this command, held in the foreground past its wait, be moved to the background. One refusal keeps it where it is."""

    reduces = FirstRefusalWins
    session: str = ""
    command: str = ""
    seconds: int = 0


@dataclass(frozen=True, kw_only=True)
class AgentMessageSending(Asked):
    """What of this turn reaches the chat, or none of it. One answerer keeping it out wins, since the turn's words belong to the row its tag writes."""

    reduces = KeepingWins
    text: str = ""
    turn: str = ""
    session: str = ""

    def rewritten(self, text: str) -> "Asked":
        return replace(self, text=text)


@dataclass(frozen=True, kw_only=True)
class TextFormatting(Asked):
    """How this text is shown. Nothing wins: every formatter reads what the one before it wrote."""

    reduces = TextsCompose
    text: str = ""
    surface: str = ""

    def rewritten(self, text: str) -> "Asked":
        return replace(self, text=text)


@dataclass(frozen=True, kw_only=True)
class HookResponding(Asked):
    """What is handed over on a hook's own answer, beside what the older responders add. Nothing wins: every text is joined in the order the answerers gave it."""

    reduces = TextsJoin
    event: str = ""
    session: str = ""
    compacted: bool = False


@dataclass(frozen=True, kw_only=True)
class RowWriting(Asked):
    """A row about to be written on the funnel. One refusal raises before the write, because a hold after the fact is no hold."""

    reduces = FirstRefusalWins
    type: str = ""
    action: str = ""
    actor: str = ""
    agent: str = ""
    """The agent the write is made on behalf of, when a command names one."""
    forced: bool = False
    """Whether the write was forced: a refusal is then recorded on the row it overrides rather than stopping it."""
    fields: tuple[tuple[str, object], ...] = field(default_factory=tuple)
    session: str = ""
