import time
from pathlib import Path

from engine.command_runs import command_runs, waiting_run
from engine.events.engine import AgentBeat, ClockTicked
from engine.gates import LONG_COMMAND, HookCall, cancelled
from features.long_commands.details import KEPT, MOVED, background_after, background_switch
from features.work_modes.modes import mode_of
from providers.command_effects import JOURNAL_CALL
from engine.sessions import Sessions
from features.long_commands.watch import background_tasks_of, running_part
from features.parts import AgentContext, Handler
from providers import DRIVERS, PROVIDERS, transcript_reader
from resources.base import SYSTEM
from controllers.types import Agents

SETTLE = 30.0
TOOK_WITHIN = 20.0


def matching_task(tasks, command: str, pressed: float) -> str:
    """The background task this command became: one started after the press, and of the command's own words when the transcript names them, else the first to start."""
    started = sorted(((at, name) for name, at in tasks.started.items() if at >= pressed - 2), key=lambda found: found[0])
    wanted = " ".join(command.split())
    own = next((name for _, name in started if wanted and " ".join(tasks.commands.get(name, "").split()) == wanted), "")
    return own or next((name for _, name in started), "")


def running_call(context: AgentContext, row):
    """The shell call the agent is actually waiting on: of the calls that have not ended, those its transcript shows answered did end, though their end was lost on the way (a hook that got no answer from a busy server is dropped), so they are closed and never moved."""
    opened = [one for one in command_runs(row) if one.tool == "Bash" and not one.done]
    reader = transcript_reader(row)
    if reader is None:
        return opened[0] if opened else None
    still = [one for one in opened if reader.command_is_open(Path(row.transcript), one.id)]
    stale = [one for one in opened if one not in still]
    if stale:
        now = time.time()
        gone = {(one.at, one.id) for one in stale}
        closed = {"commands": [{**kept, "done": now} if (kept.get("at"), kept.get("id", "")) in gone and not kept.get("done") else kept for kept in row.commands]}
        if row.running and not row.running.get("done") and (row.running.get("at"), row.running.get("id", "")) in gone:
            closed["running"] = {**row.running, "done": now}
        Agents(context.record, actor=SYSTEM).update(row.n, **closed)
    return still[0] if still else None


def wait_for(context: AgentContext, command: str) -> float:
    """How long this command may hold the terminal: the wait of the environment's work mode while that mode's switch is on, but a journal command always keeps the longer one."""
    mode, settings = mode_of(context.record), context.settings
    if settings[background_switch(mode)] and not JOURNAL_CALL.match(command.strip()):
        return settings[background_after(mode)]
    return settings.after_seconds


class MoveLongCommands(Handler):
    """Moves a command that holds the terminal too long, on the engine's own beat, so no slow upkeep of the clock can delay it."""

    def handle(self, context: AgentContext, event: AgentBeat) -> None:
        row = context.agent.row
        if not row.live:
            return
        oldest = waiting_run(row)
        provider = row.provider
        driver = DRIVERS.get(provider)
        if oldest is None or not driver or not driver.MOVE_TO_BACKGROUND or time.time() - oldest.at < wait_for(context, oldest.command):
            return
        if context.state.get("moved") == str(oldest.at):
            return
        last = running_call(context, row)
        if last is None:
            return
        started = str(last.at)
        seconds = int(time.time() - float(started))
        if seconds < wait_for(context, last.command) or not context.once("asked", started):
            return
        reason = cancelled(LONG_COMMAND, HookCall(PROVIDERS[provider]() if provider in PROVIDERS else None, context.record, None, row),
                           {"command": last.command, "seconds": seconds})
        if reason:
            context.agent.say(KEPT, reason=reason)
            return
        context.state.set("moved", started)
        context.state.set("task", "")
        context.state.set("pressed", time.time())
        context.agent.move_to_background(started)
        if not PROVIDERS[provider].result_names_move:
            context.agent.say(MOVED, seconds=int(time.time() - float(started)))
        context.journal.get(Agents)._moved_to_background(last, row, state="running", started=float(started))


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
        run = next((one for one in command_runs(row) if str(one.at) == started), None)
        pressed = float(context.state.get("pressed") or started)
        task = context.state.get("task") or matching_task(tasks, run.command if run else "", pressed)
        if not task:
            if run is not None and not run.done and time.time() - pressed > TOOK_WITHIN and not context.state.get("retried"):
                context.state.set("retried", started)
                context.state.set("pressed", time.time())
                context.agent.move_to_background(started)
                return
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
        """A chained command's card names only the part still running, as its process shows; the part its row last named counts only when it began with this command and has not been answered since."""
        run = next((one for one in command_runs(row) if str(one.at) == started), None)
        part = running_part(Sessions(context.record.root).read(row.title).pid, run.command) if run else ""
        step = row.step if row.step and float(row.step.get("at", 0)) >= float(started) else {}
        part = part or step.get("command", "")
        if part and context.state.get("part") != part:
            context.state.set("part", part)
            context.journal.get(Agents).card(row.n, key=f"command:{started}", command=part)
