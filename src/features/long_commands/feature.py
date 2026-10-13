import json

from events.agents import AgentBeat, ClockTicked
from events.long_commands import CallsLost, LongCommandHeld, LongCommandKept, MoveNotTaken, MovedCommandEnded, PartRunning, TaskFound
from expects import Dispatches, Given, Nudged, Ran, Remembered, Updated, at, nothing
from features.long_commands.details import RUN_ENDED, RUN_OPEN, RUN_STALLED, WATCHED, LongCommandsDetails
from features.long_commands.handlers import CloseLostCalls, CloseTheMovedCommand, MoveToTheBackground, PressMoveAgain, SayLongCommandKept, ShowThePartRunning, KeepTheTask
from features.long_commands.listeners import SpotLongCommand, SpotMovedCommand
from features.long_commands.watch import ended_runs, open_runs, stalled_runs
from framework.base import Feature
from framework.journal import Journal
from framework.sending import Nudge
from resources.types import AgentRow

NOW = at(1_000.0)
STARTED = 955.0
ORCHESTRATING = {"work_modes.mode": "orchestrator"}
MOVED = {"long_commands.moved|1": "955.0"}
PRESSED = {**MOVED, "long_commands.pressed|1": 975.0}
TASKED = {**MOVED, "long_commands.task|1": "b1"}
MARKED = {"key": "command:955.0", "label": "Moved a long command to the background", "state": "running", "command": "npm test"}


def agent(command: str = "npm test", started: float = STARTED, status: str = "working", provider: str = "claude", **more) -> AgentRow:
    return AgentRow(n=1, title="claude-1", data={"status": status, "provider": provider, "commands": [{"command": command, "tool": "Bash", "at": started, **more}]})


def marked() -> AgentRow:
    return AgentRow(n=1, title="claude-1", data={"status": "working", "provider": "claude", "cards": [MARKED]})


def lost_in(transcript: list[dict]) -> str:
    return "".join(json.dumps(row) + "\n" for row in transcript)


ASKED = {"type": "assistant", "timestamp": "1970-01-01T00:16:00Z", "message": {"content": [{"type": "tool_use", "id": "t1", "name": "Bash", "input": {"command": "npm test"}}]}}
ANSWERED = {"type": "user", "timestamp": "1970-01-01T00:16:01Z", "message": {"content": [{"type": "tool_result", "tool_use_id": "t1", "content": "passed"}]}}
BACKGROUNDED = {"type": "user", "timestamp": "1970-01-01T00:20:00Z",
                "message": {"content": [{"type": "tool_result", "tool_use_id": "t1", "content": "Command running in background with ID: b1"}]}}


def finished(status: str) -> dict:
    return {"type": "user", "timestamp": "1970-01-01T00:21:40Z", "message": {"content": [{"type": "text", "text": f"<task-notification><task-id>b1</task-id><status>{status}</status></task-notification>"}]}}


class LongCommands(Feature):
    details = LongCommandsDetails
    nudges = (Nudge(RUN_ENDED, behaviour=WATCHED, about=ended_runs, once=True,
                    guarantee="When a command the agent left running finishes, it is told once, with how the command ended."),
              Nudge(RUN_STALLED, behaviour=WATCHED, about=stalled_runs, once=True,
                    guarantee="A command the agent left running that has shown nothing new is named every five minutes it keeps running, whatever its provider, so a hung run is not waited on for ever."),
              Nudge(RUN_OPEN, behaviour=WATCHED, about=open_runs, once=True,
                    guarantee="When the agent stops while a command it started is still running, it is told once, so nothing is left running unwatched."))

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentBeat, SpotLongCommand(), expects=[
            Given(AgentBeat(agent=1), rows=[agent()], clock=NOW)
                >> Dispatches(LongCommandHeld(agent=1, command="npm test", started="955.0", provider="claude").once("asked|1|955.0")),
            Given(AgentBeat(agent=1), rows=[agent(started=990.0)], clock=NOW) >> Dispatches(nothing),
            Given(AgentBeat(agent=1), rows=[agent(status="stopped")], clock=NOW) >> Dispatches(nothing),
            Given(AgentBeat(agent=1), rows=[agent()], clock=NOW, remembered=MOVED) >> Dispatches(nothing),
            Given(AgentBeat(agent=1), rows=[agent(provider="codex")], clock=NOW) >> Dispatches(nothing),
            Given(AgentBeat(agent=1), rows=[agent(started=990.0)], clock=NOW, settings=ORCHESTRATING)
                >> Dispatches(LongCommandHeld(agent=1, command="npm test", started="990.0", provider="claude").once("asked|1|990.0")),
            Given(AgentBeat(agent=1), rows=[agent(command="journal message read 5", started=990.0)], clock=NOW, settings=ORCHESTRATING) >> Dispatches(nothing),
            Given(AgentBeat(agent=1), rows=[agent(id="t1")], clock=NOW, transcript=lost_in([ASKED, ANSWERED])) >> Dispatches(CallsLost(agent=1, gone=((STARTED, "t1"),))),
        ])
        journal.events.handle(CallsLost, CloseLostCalls(), expects=[
            Given(CallsLost(agent=1, gone=((STARTED, "t1"),)), rows=[agent(id="t1")], clock=NOW)
                >> Updated(AgentRow(n=1), commands=[{"command": "npm test", "tool": "Bash", "at": STARTED, "id": "t1", "done": 1_000.0}]),
        ])
        journal.events.handle(LongCommandHeld, MoveToTheBackground(), expects=[
            Given(LongCommandHeld(agent=1, command="npm test", started="955.0", provider="claude"), rows=[agent()], clock=NOW)
                >> Ran(("move to background", "955.0")) & Remembered("moved|1", "955.0") & Remembered("task|1", "") & Remembered("pressed|1", 1_000.0)
                & Updated(AgentRow(n=1), cards=[{"key": "command:955.0", "label": "Moved a long command to the background", "state": "running", "command": "npm test"}]),
        ])
        journal.events.handle(LongCommandKept, SayLongCommandKept(), expects=[
            Given(LongCommandKept(agent=1, reason="pulse: a build is running"), rows=[agent()]) >> Nudged("kept", reason="pulse: a build is running"),
        ])
        journal.events.listen(ClockTicked, SpotMovedCommand(), expects=[
            Given(ClockTicked(agent=1), rows=[agent(done=957.0)], clock=NOW) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent(done=957.0)], clock=NOW, remembered={**MOVED, "long_commands.ended|1": "955.0"}) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent(done=957.0)], clock=NOW, remembered=MOVED)
                >> Dispatches(MovedCommandEnded(agent=1, started="955.0", state="done", ended=957.0)),
            Given(ClockTicked(agent=1), rows=[agent(done=990.0)], clock=NOW, remembered=MOVED) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent()], clock=NOW, remembered=PRESSED) >> Dispatches(MoveNotTaken(agent=1, started="955.0")),
            Given(ClockTicked(agent=1), rows=[agent()], clock=NOW, remembered={**PRESSED, "long_commands.retried|1": "955.0"}) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent()], clock=NOW, remembered={**MOVED, "long_commands.pressed|1": 990.0}) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent(status="stopped")], clock=NOW, remembered=MOVED) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[agent()], clock=NOW, remembered=MOVED, transcript=lost_in([BACKGROUNDED]))
                >> Dispatches(TaskFound(agent=1, task="b1")),
            Given(ClockTicked(agent=1), rows=[agent()], clock=NOW, remembered=MOVED, transcript=lost_in([BACKGROUNDED, finished("failed")]))
                >> Dispatches(TaskFound(agent=1, task="b1")) & Dispatches(MovedCommandEnded(agent=1, started="955.0", state="failed", ended=1_300.0)),
            Given(ClockTicked(agent=1), rows=[agent()], clock=NOW, remembered=TASKED, transcript=lost_in([BACKGROUNDED, finished("completed")]))
                >> Dispatches(MovedCommandEnded(agent=1, started="955.0", state="done", ended=1_300.0)),
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "provider": "claude", "step": {"command": "sleep 25", "at": 960.0},
                                                                                     "commands": [{"command": "cd x; sleep 25; echo finished", "tool": "Bash", "at": STARTED}]})],
                  clock=NOW, remembered=TASKED)
                >> Dispatches(PartRunning(agent=1, started="955.0", part="sleep 25")),
            Given(ClockTicked(agent=1), rows=[agent()], clock=NOW, remembered={**TASKED, "long_commands.part|1": "sleep 25"}) >> Dispatches(nothing),
        ])
        journal.events.handle(MoveNotTaken, PressMoveAgain(), expects=[
            Given(MoveNotTaken(agent=1, started="955.0"), rows=[agent()], clock=NOW) >> Ran(("move to background", "955.0")) & Remembered("retried|1", "955.0") & Remembered("pressed|1", 1_000.0),
        ])
        journal.events.handle(TaskFound, KeepTheTask(), expects=[
            Given(TaskFound(agent=1, task="b1"), rows=[agent()]) >> Remembered("task|1", "b1"),
        ])
        journal.events.handle(PartRunning, ShowThePartRunning(), expects=[
            Given(PartRunning(agent=1, started="955.0", part="sleep 25"), rows=[marked()])
                >> Remembered("part|1", "sleep 25") & Updated(AgentRow(n=1), cards=[{"key": "command:955.0", "command": "sleep 25"}]),
        ])
        journal.events.handle(MovedCommandEnded, CloseTheMovedCommand(), expects=[
            Given(MovedCommandEnded(agent=1, started="955.0", state="failed", ended=1_300.0), rows=[marked()])
                >> Remembered("ended|1", "955.0") & Updated(AgentRow(n=1), cards=[{"key": "command:955.0", "state": "failed", "ended": 1_300.0}]),
        ])
