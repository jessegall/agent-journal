import time
from pathlib import Path

from engine.events.engine import ClockTicked
from engine.gates import LONG_COMMAND, cancelled
from engine.sessions import alive
from engine.wording import clipped
from features.long_commands.details import KEPT, MOVED
from features.nudges import MINUTE, Sent
from features.parts import AgentContext, Handler
from providers import DRIVERS, PROVIDERS
from providers.base import BackgroundTasks
from features.status_bar.runs import CommandRun, command_runs

FOREGROUND = "Bash"
RECENT = 10 * MINUTE
STALLED_AFTER = 10 * MINUTE
DAY = 24 * 60 * MINUTE


class MoveLongCommands(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        row = context.agent.row
        moved = context.state.get("moved")
        if moved and context.state.get("ended") != moved:
            self.follow(context, row, moved)
        runs = command_runs(row)
        last = runs[-1] if runs else CommandRun()
        if last.tool != FOREGROUND or last.done:
            return
        started = str(last.at)
        provider = row.provider
        driver = DRIVERS.get(provider)
        seconds = int(time.time() - float(started))
        if not driver or not driver.MOVE_TO_BACKGROUND or seconds < context.settings.after_seconds or not context.once("asked", started):
            return
        reason = cancelled(LONG_COMMAND, PROVIDERS[provider]() if provider in PROVIDERS else None, context.record, None, row.title,
                           {"command": last.command, "seconds": seconds}, row.subagent)
        if reason:
            context.agent.say(KEPT, reason=reason)
            return
        context.state.set("moved", started)
        context.state.set("task", "")
        context.agent.move_to_background()
        context.agent.say(MOVED, seconds=seconds)
        context.journal.agents.card(row.n, key=f"command:{started}", label="Moved a long command to the background", icon="terminal",
                                    command=last.command, state="running", started=float(started))

    def follow(self, context: AgentContext, row, started: str) -> None:
        provider = PROVIDERS.get(row.provider)
        if not provider or not row.transcript:
            return
        tasks = provider().background_tasks(Path(row.transcript))
        task = context.state.get("task") or next((name for name, at in sorted(tasks.started.items(), key=lambda kv: kv[1])
                                                  if at >= float(started)), "")
        if not task:
            return
        context.state.set("task", task)
        if task in tasks.ended:
            context.state.set("ended", started)
            outcome = "failed" if task in tasks.failed else "done"
            context.journal.agents.card(row.n, key=f"command:{started}", state=outcome, ended=tasks.ended[task])



def unwatched_runs(agent) -> BackgroundTasks:
    provider = PROVIDERS.get(agent.provider)
    if not provider or provider.background_wakes or not agent.transcript:
        return BackgroundTasks()
    tasks = provider().background_tasks(Path(agent.transcript))
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
