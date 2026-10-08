import time

from agents.terminal import launch_failure
from engine.events.engine import ClockTicked
from engine.events.resources import AgentChanged
from engine.sessions import Sessions, alive
from features.helpers.controller import Helpers
from features.parts import AgentContext, Handler, OnAgentUpdated
from features.trigger import MINUTE
from resources.base import SYSTEM
from resources.types import FAILED


class TellAFailedTurn(Handler):
    def handle(self, context: AgentContext, event: AgentChanged) -> None:
        row = context.agent.row
        if row.event == FAILED:
            Helpers(context.record, actor=SYSTEM)._failed(row.failure)


class TellAFailedTurnOnChange(OnAgentUpdated, TellAFailedTurn):
    pass


def still_unreported(journal, rows: tuple[str, ...]) -> bool:
    return any(row.ref in rows and not (row.report or row.stopped_by_user) for row in journal.get(Helpers).rows.standing())


class NameStoppedOrQuietHelpers(Handler):
    behaviour = "watch"

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        speaking = context.to_primary()
        if not speaking:
            return
        quiet_after = float(context.settings.quiet_after) * MINUTE
        sessions = list(Sessions(context.record.root).all().values())
        for row in Helpers(context.record, actor=SYSTEM).rows.standing():
            theirs = [s for s in sessions if s.environment == row.environment]
            if row.report or row.stopped_by_user or not theirs:
                continue
            last_seen = max(s.last_heard for s in theirs)
            stopped = all(s.pid and not alive(s.pid) for s in theirs)
            if stopped and speaking.once("helper stopped", f"{row.n}:{last_seen}"):
                speaking.agent.say("stopped", n=row.n, name=row.name, cause=launch_failure(context.record.root, row.environment), rows=[row.ref])
            elif not stopped and time.time() - last_seen >= quiet_after and speaking.once("helper quiet", f"{row.n}:{last_seen}"):
                speaking.agent.say("quiet", n=row.n, name=row.name, minutes=int((time.time() - last_seen) // MINUTE))
