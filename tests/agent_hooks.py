import time as timing
from dataclasses import dataclass

from journal.engine.clock import Clock
from journal.support.typed_lines import JOURNAL_PREFIX, TypedLines
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink
from journal.support.supervisor_reply import SupervisorReply
from tests.in_process import posted
from journal.support.time_source import TimeSource


@dataclass(frozen=True)
class Tools:
    """The names a provider's agent uses for reading, writing, the shell and sending a subagent."""

    read: str
    write: str
    shell: str
    subagent: str


TOOLS = {"claude": Tools("Read", "Write", "Bash", "Agent"), "codex": Tools("read_file", "write_file", "Bash", "collaborationspawn_agent")}
PROVIDERS = tuple(TOOLS)


def hook_as(app, provider: str, type_name: str, session: str = "s1", **body):
    """A hook as the provider's agent sends it, for the session named: the status and the answer."""
    return posted(app, f"/hooks/{provider}", {"hook_event_name": type_name, "session_id": session, **body}, {"X-Journal-Env": "main"})


def typing_capture(app, monkeypatch, keystrokes: list) -> None:
    """Catches each line typed to the agent into typed and confirms it at once, as the agent's prompt hook would, so the next is not held behind it."""
    lines = app.container.get(TypedLines)

    def keystroke_capture(link, environment_id: int, verb: str, fields: dict) -> SupervisorReply:
        if "line" not in fields:
            return SupervisorReply(False, "no supervisor runs here")
        keystrokes.append(fields["line"])
        lines.confirm(environment_id, fields["line"])
        return SupervisorReply(True)

    monkeypatch.setattr(SupervisorLink, "_send", keystroke_capture)


def woken_capture(app, monkeypatch, keystrokes: list) -> None:
    """Catches what reaches a stopped agent as an agent that wakes and stops again at once sees it: the line typed into its terminal, taken back by its prompt, and every line waiting that the prompt's answer carries, each caught into keystrokes; then the agent stops, so the next line is typed again."""
    lines = app.container.get(TypedLines)

    def woken(link, environment_id: int, verb: str, fields: dict) -> SupervisorReply:
        if "line" not in fields:
            return SupervisorReply(False, "no supervisor runs here")
        keystrokes.append(fields["line"])
        lines.confirm(environment_id, fields["line"])
        keystrokes.extend(f"{JOURNAL_PREFIX} {line}" for line in lines.pending_lines(environment_id))
        lines.rest(environment_id)
        return SupervisorReply(True)

    monkeypatch.setattr(SupervisorLink, "_send", woken)


def pinned_clock(app, monkeypatch) -> None:
    """The journal's time source pinned at the whole second the replay starts, so every hook and every row notes its time there, a tick says how long after it was, and each later moment is exact."""
    clock = app.container.get(Clock)
    clock.held_at = float(int(timing.time()))
    monkeypatch.setattr(app.container.get(TimeSource), "pinned_seconds", clock.held_at)


def pass_time(app, seconds: float) -> None:
    """The held moment moved on, so the hooks after it come so many seconds later."""
    clock = app.container.get(Clock)
    clock.held_at += seconds
    app.container.get(TimeSource).pin(clock.held_at)


def silent_tick(app, silent: float) -> list:
    """A tick so many seconds after the held moment, the agent silent all that time."""
    return tick_at(app, silent, silent)


def tick_at(app, later: float, silence_seconds: float) -> list:
    """A tick so many seconds after the held moment, once what came before it has settled on the worker thread, as the clock gives it, its answers handed back; the moment is set and the clock held again inside the tick lock, so the runtime's own tick never takes the moment for its own."""
    from journal.engine.support.session_agents import SessionAgents
    from journal.events.agent.ticked import Ticked
    app.runtime().deferred.drain()
    clock = app.container.get(Clock)
    environment = app.container.get(Environments).lookup("main").id
    source = app.container.get(TimeSource)
    with clock.tick_lock:
        source.pin(clock.held_at + later)
        try:
            agent = app.container.get(SessionAgents).agent("s1", environment)
            return clock.ticked(Ticked(silence_seconds=silence_seconds, agent=agent).placed(agent, None, source.seconds()))
        finally:
            source.pin(clock.held_at)
