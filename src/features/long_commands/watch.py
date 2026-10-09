import subprocess
import time
from collections import defaultdict
from pathlib import Path

from engine.sessions import alive
from engine.wording import clipped
from features.sending import Sent
from features.trigger import DAY, MINUTE
from providers import PROVIDERS, transcript_reader
from providers.base import BackgroundTasks

RECENT = 10 * MINUTE
STALLED_AFTER = 10 * MINUTE
PS_TIMEOUT = 2


def background_tasks_of(agent) -> BackgroundTasks:
    reader = transcript_reader(agent)
    return reader.background_tasks(Path(agent.transcript)) if reader else BackgroundTasks()


def unwatched_runs(agent) -> BackgroundTasks:
    provider = PROVIDERS.get(agent.provider)
    if provider and provider.background_wakes:
        return BackgroundTasks()
    tasks = background_tasks_of(agent)
    for key, pid in tasks.detached.items():
        if key not in tasks.ended and not alive(pid):
            tasks.ended[key] = time.time()
    return tasks


def described(tasks: BackgroundTasks, session: str) -> dict:
    return {"command": clipped(tasks.commands.get(session) or f"session {session}", 120)}


def open_since(tasks: BackgroundTasks) -> dict[str, float]:
    now = time.time()
    return {session: now - tasks.printed.get(session, at) for session, at in tasks.started.items() if session not in tasks.ended and now - at < DAY}


def ended_runs(context, agent) -> list[Sent]:
    tasks, now = unwatched_runs(agent), time.time()
    return [Sent(session, {**described(tasks, session), "outcome": "failed" if session in tasks.failed else "finished"})
            for session, at in tasks.ended.items() if now - at < RECENT]


def open_runs(context, agent) -> list[Sent]:
    if not agent.idle_for:
        return []
    tasks = unwatched_runs(agent)
    return [Sent(session, described(tasks, session)) for session in open_since(tasks)]


def stalled_runs(context, agent) -> list[Sent]:
    tasks = unwatched_runs(agent)
    return [Sent(session, {**described(tasks, session), "minutes": int(running // MINUTE)})
            for session, running in open_since(tasks).items() if running >= STALLED_AFTER]


def running_part(pid: int, chain: str) -> str:
    """The command of the agent's process tree that is still running and written in the chained command, or nothing when no part of it runs as a process of its own."""
    if not pid:
        return ""
    try:
        listed = subprocess.run(["ps", "-eo", "pid=,ppid=,command="], capture_output=True, text=True, timeout=PS_TIMEOUT).stdout
    except (OSError, subprocess.SubprocessError):
        return ""
    below = defaultdict(list)
    for line in listed.splitlines():
        fields = line.split(None, 2)
        if len(fields) == 3 and fields[0].isdigit() and fields[1].isdigit():
            below[int(fields[1])].append((int(fields[0]), fields[2].strip()))
    leaves, waiting = [], [pid]
    while waiting:
        for child, command in below[waiting.pop()]:
            waiting.append(child)
            if not below[child]:
                leaves.append(command)
    return next((clipped(command, 200) for command in reversed(leaves) if command in chain), "")
