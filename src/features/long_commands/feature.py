from events.agents import AgentBeat, ClockTicked
from expects import Given, Unchanged
from features.base import Feature
from features.journal import Journal
from features.long_commands.details import RUN_ENDED, RUN_OPEN, RUN_STALLED, WATCHED, LongCommandsDetails
from features.long_commands.move import FollowMovedCommands, MoveLongCommands
from features.long_commands.watch import ended_runs, open_runs, stalled_runs
from features.sending import Nudge
from resources.types import AgentRow


class LongCommands(Feature):
    details = LongCommandsDetails
    nudges = (Nudge(RUN_ENDED, behaviour=WATCHED, about=ended_runs, once=True,
                    guarantee="When a command the agent left running finishes, it is told once, with how the command ended."),
              Nudge(RUN_STALLED, behaviour=WATCHED, about=stalled_runs, once=True,
                    guarantee="When a command the agent left running has shown nothing new for a while, it is told once, so a hung run is not waited on for ever."),
              Nudge(RUN_OPEN, behaviour=WATCHED, about=open_runs, once=True,
                    guarantee="When the agent stops while a command it started is still running, it is told once, so nothing is left running unwatched."))

    def register(self, journal: Journal) -> None:
        journal.events.handler(MoveLongCommands(), expects=[
            Given(AgentBeat(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "stopped", "provider": "claude"})]) >> Unchanged(),
            Given(AgentBeat(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "provider": "claude"})]) >> Unchanged(),
        ])
        journal.events.handler(FollowMovedCommands(), expects=[
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "stopped", "provider": "claude"})]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "provider": "claude"})]) >> Unchanged(),
        ])
