from pathlib import Path

from resources.command_runs import command_runs, open_shell_runs, waiting_run
from events import Fact
from events.agents import AgentBeat, ClockTicked
from events.long_commands import CallsLost, LongCommandHeld, MoveNotTaken, MovedCommandEnded, PartRunning, TaskFound
from features.long_commands.details import background_after, background_switch
from features.long_commands.watch import background_tasks_of, part_of
from resources.work_modes import kept_mode
from framework.command_effects import JOURNAL_CALL
from receiving import Listener
from resources.types import AgentRow
from serving import Clock, Providers, ReadProcesses, ReadRemembered, ReadRows, ReadSessions, Settings

SETTLE = 30.0
TOOK_WITHIN = 20.0


def memory(name: str, agent: int) -> str:
    return f"{name}|{agent}"


def wait_for(settings: Settings, command: str) -> float:
    """How long this command may hold the terminal: the wait of the environment's work mode while that mode's switch is on, but a journal command always keeps the longer one."""
    mode = kept_mode(settings.of("work_modes").mode)
    if getattr(settings, background_switch(mode)) and not JOURNAL_CALL.match(command.strip()):
        return getattr(settings, background_after(mode))
    return settings.after_seconds


def matching_task(tasks, command: str, pressed: float) -> str:
    """The background task this command became: one started after the press, and of the command's own words when the transcript names them, else the first to start."""
    started = sorted(((at, name) for name, at in tasks.started.items() if at >= pressed - 2), key=lambda found: found[0])
    wanted = " ".join(command.split())
    own = next((name for _, name in started if wanted and " ".join(tasks.commands.get(name, "").split()) == wanted), "")
    return own or next((name for _, name in started), "")


def open_calls(row: AgentRow, providers: Providers) -> tuple[list, list]:
    """The shell calls the agent is waiting on and, apart, those its transcript shows answered, though their end was lost on the way."""
    opened = open_shell_runs(row)
    reader = providers.reader(row)
    if reader is None:
        return opened[:1], []
    still = [one for one in opened if reader.command_is_open(Path(row.transcript), one.id)]
    return still[:1], [one for one in opened if one not in still]


class SpotLongCommand(Listener[AgentBeat]):
    def listen(self, event: AgentBeat, agents: ReadRows[AgentRow], settings: Settings, remembered: ReadRemembered, providers: Providers, clock: Clock) -> list[Fact]:
        row, now = agents.peek(event.agent), clock.now()
        oldest = waiting_run(row)
        if not row.live or oldest is None or not providers.knows(row.provider):
            return []
        if not providers.driver(row.provider).MOVE_TO_BACKGROUND or now - oldest.at < wait_for(settings, oldest.command):
            return []
        if remembered.get(memory("moved", event.agent)) == str(oldest.at):
            return []
        still, stale = open_calls(row, providers)
        last = still[0] if still else None
        lost = [CallsLost(agent=event.agent, gone=tuple((one.at, one.id) for one in stale))] if stale else []
        if last is None or now - float(last.at) < wait_for(settings, last.command):
            return lost
        return [*lost, LongCommandHeld(agent=event.agent, command=last.command, started=str(last.at), provider=row.provider).once(f"asked|{event.agent}|{last.at}")]


class SpotMovedCommand(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, agents: ReadRows[AgentRow], remembered: ReadRemembered, providers: Providers, clock: Clock,
               sessions: ReadSessions, processes: ReadProcesses) -> list[Fact]:
        row, started = agents.peek(event.agent), remembered.get(memory("moved", event.agent))
        if not row.live or not started or remembered.get(memory("ended", event.agent)) == started:
            return []
        tasks, now = background_tasks_of(providers, row), clock.now()
        run = next((one for one in command_runs(row) if str(one.at) == started), None)
        pressed = float(remembered.get(memory("pressed", event.agent)) or started)
        task = remembered.get(memory("task", event.agent)) or matching_task(tasks, run.command if run else "", pressed)
        if not task:
            return self.unmoved(event.agent, started, run, pressed, now, remembered)
        known = [] if remembered.get(memory("task", event.agent)) else [TaskFound(agent=event.agent, task=task)]
        if task in tasks.ended:
            return [*known, MovedCommandEnded(agent=event.agent, started=started, state="failed" if task in tasks.failed else "done", ended=tasks.ended[task])]
        part = self.running(row, run, sessions, processes)
        return [*known, *([PartRunning(agent=event.agent, started=started, part=part)] if part and remembered.get(memory("part", event.agent)) != part else [])]

    def unmoved(self, agent: int, started: str, run, pressed: float, now: float, remembered: ReadRemembered) -> list[Fact]:
        """A command that never became a task is pressed again once; one that ended before it could be moved closes its card."""
        if run is not None and not run.done and now - pressed > TOOK_WITHIN and not remembered.get(memory("retried", agent)):
            return [MoveNotTaken(agent=agent, started=started)]
        if run is None or not run.done or now - run.done < SETTLE:
            return []
        return [MovedCommandEnded(agent=agent, started=started, state="done", ended=run.done)]

    def running(self, row: AgentRow, run, sessions: ReadSessions, processes: ReadProcesses) -> str:
        """A chained command's card names only the part still running, as its process shows; the part its row last named counts only when it began with this command and has not been answered since."""
        if run is None:
            return ""
        step = row.step if row.step and float(row.step.get("at", 0)) >= run.at else {}
        return part_of(processes.leaves(sessions.read(row.title).pid), run.command) or step.get("command", "")
