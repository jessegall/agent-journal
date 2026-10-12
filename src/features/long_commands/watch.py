import time
from pathlib import Path

from engine.sessions import alive
from resources.text import clipped
from framework.sending import Sent
from declaring.trigger import MINUTE
from serving import SERVED, Processes, Providers
from resources.runs import BackgroundTasks

RECENT = 10 * MINUTE
STALLED_AFTER = 5 * MINUTE
GIVEN_UP_ON = 2 * 60 * MINUTE


def background_tasks_of(agent) -> BackgroundTasks:
    reader = SERVED.given(Providers).reader(agent)
    return reader.background_tasks(Path(agent.transcript)) if reader else BackgroundTasks()


def runs_of(agent) -> BackgroundTasks:
    """Every background run the agent has, with the ones whose process is gone marked ended."""
    tasks = background_tasks_of(agent)
    for key, pid in tasks.detached.items():
        if key not in tasks.ended and not alive(pid):
            tasks.ended[key] = time.time()
    return tasks


def unwatched_runs(agent) -> BackgroundTasks:
    """The runs no provider will tell the agent about when they end. A provider that wakes its agent needs no help there."""
    provider = SERVED.given(Providers).offers(agent.provider)
    return BackgroundTasks() if provider and provider.background_wakes else runs_of(agent)


def described(tasks: BackgroundTasks, session: str) -> dict:
    return {"command": clipped(tasks.commands.get(session) or f"session {session}", 120)}


def open_since(tasks: BackgroundTasks) -> dict[str, float]:
    """How long each run worth telling the agent about has shown nothing new. A run whose command was never recorded gives it nothing to act on, and one still listed hours later is lost rather than slow, so neither is counted."""
    now = time.time()
    return {session: now - tasks.printed.get(session, at) for session, at in tasks.started.items()
            if session not in tasks.ended and now - at < GIVEN_UP_ON and tasks.commands.get(session)}


def ended_runs(context, agent) -> list[Sent]:
    tasks, now = unwatched_runs(agent), time.time()
    return [Sent(session, {**described(tasks, session), "outcome": "failed" if session in tasks.failed else "finished"})
            for session, at in tasks.ended.items() if now - at < RECENT]


def open_runs(context, agent) -> list[Sent]:
    if not agent.idle_for:
        return []
    tasks = runs_of(agent)
    return [Sent(session, described(tasks, session)) for session in open_since(tasks)]


def stalled_runs(context, agent) -> list[Sent]:
    """A run going a long while with nothing new to show, whatever the provider: a command that never ends wakes nobody, so a provider's own wake is no reason to stay quiet about one."""
    tasks = runs_of(agent)
    return [Sent(f"{session}:{int(running // STALLED_AFTER)}", {**described(tasks, session), "minutes": int(running // MINUTE)})
            for session, running in open_since(tasks).items()
            if running >= STALLED_AFTER]


def running_part(pid: int, chain: str) -> str:
    """The command of the agent's process tree that is still running and written in the chained command, or nothing when no part of it runs as a process of its own."""
    return next((clipped(command, 200) for command in reversed(SERVED.given(Processes).leaves(pid)) if command in chain), "")
