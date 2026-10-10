import time
from pathlib import Path

from engine.command_runs import command_runs, waiting_run
from engine.events.engine import AgentBeat, ClockTicked
from engine.gates import LONG_COMMAND, HookCall, cancelled
from features.long_commands.details import KEPT, MOVED
from engine.sessions import Sessions
from features.long_commands.watch import background_tasks_of, running_part
from features.parts import AgentContext, Handler
from providers import DRIVERS, PROVIDERS, transcript_reader
from providers.command_effects import settled
from resources.base import SYSTEM
from controllers.types import Agents

SETTLE = 30.0


def has_come_back(context: AgentContext, row) -> bool:
    """An open call the transcript shows as answered did end, though its end was lost on the way (a hook that got no answer from a busy server is dropped), so it is closed and never moved."""
    reader = transcript_reader(row)
    if reader is None or reader.command_is_open(Path(row.transcript)):
        return False
    Agents(context.record, actor=SYSTEM).update(row.n, **settled(row, time.time()))
    return True


class MoveLongCommands(Handler):
    """Moves a command that holds the terminal too long, on the engine's own beat, so no slow upkeep of the clock can delay it."""

    def handle(self, context: AgentContext, event: AgentBeat) -> None:
        row = context.agent.row
        if not row.live:
            return
        last = waiting_run(row)
        if last is None:
            return
        started = str(last.at)
        seconds = int(time.time() - float(started))
        provider = row.provider
        driver = DRIVERS.get(provider)
        if not driver or not driver.MOVE_TO_BACKGROUND or seconds < context.settings.after_seconds or not context.once("asked", started):
            return
        if has_come_back(context, row):
            return
        reason = cancelled(LONG_COMMAND, HookCall(PROVIDERS[provider]() if provider in PROVIDERS else None, context.record, None, row),
                           {"command": last.command, "seconds": seconds})
        if reason:
            context.agent.say(KEPT, reason=reason)
            return
        context.state.set("moved", started)
        context.state.set("task", "")
        context.agent.move_to_background()
        context.agent.say(MOVED, seconds=seconds)
        context.journal.get(Agents)._moved_to_background(row, state="running", started=float(started))


class FollowMovedCommands(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        row = context.agent.row
        if not row.live:
            return
        moved = context.state.get("moved")
        if moved and context.state.get("ended") != moved:
            self.follow(context, row, moved)

    def follow(self, context: AgentContext, row, started: str) -> None:
        tasks = background_tasks_of(row)
        task = context.state.get("task") or next((name for name, at in sorted(tasks.started.items(), key=lambda kv: kv[1])
                                                  if at >= float(started)), "")
        if not task:
            return self.close_unmoved(context, row, started)
        context.state.set("task", task)
        if task not in tasks.ended:
            self.show_running(context, row, started)
        if task in tasks.ended:
            context.state.set("ended", started)
            outcome = "failed" if task in tasks.failed else "done"
            context.journal.get(Agents).card(row.n, key=f"command:{started}", state=outcome, ended=tasks.ended[task])

    def close_unmoved(self, context: AgentContext, row, started: str) -> None:
        """A command that ended before it could be moved never starts a background task, so its card closes with the command."""
        run = next((one for one in command_runs(row) if str(one.at) == started and one.done), None)
        if run is None or time.time() - run.done < SETTLE:
            return
        context.state.set("ended", started)
        context.journal.get(Agents).card(row.n, key=f"command:{started}", state="done", ended=run.done)

    def show_running(self, context: AgentContext, row, started: str) -> None:
        """A chained command's card names only the part still running, as its process shows."""
        run = next((one for one in command_runs(row) if str(one.at) == started), None)
        part = ""
        if row.step:
            part = row.step.get("command")
        elif run:
            part = running_part(Sessions(context.record.root).read(row.title).pid, run.command)
        if part and context.state.get("part") != part:
            context.state.set("part", part)
            context.journal.get(Agents).card(row.n, key=f"command:{started}", command=part)
