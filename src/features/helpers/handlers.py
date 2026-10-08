import time

from agents.terminal import Launched, launch_failure
from engine.seats import terminal_of
from engine.events.engine import ClockTicked
from engine.events.resources import AgentChanged
from engine.sessions import Sessions, alive
from controllers.types import Agents
from engine.record import Record
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


def gone(root, name: str, session) -> bool:
    launched = Launched.read(root, terminal_of(root, name) or name)
    return bool(session.pid) and not alive(session.pid) and not (launched.pid and alive(launched.pid))


class NameStoppedOrQuietHelpers(Handler):
    behaviour = "watch"

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        speaking = context.to_primary()
        if not speaking:
            return
        quiet_after = float(context.settings.quiet_after) * MINUTE
        root = context.record.root
        sessions = Sessions(root).all()
        for row in Helpers(context.record, actor=SYSTEM).rows.standing():
            theirs = {name: s for name, s in sessions.items() if s.environment == row.environment}
            if row.report or row.stopped_by_user or not theirs:
                continue
            last_seen = max(s.last_heard for s in theirs.values())
            stopped = all(gone(root, name, s) for name, s in theirs.items())
            if stopped and speaking.once("helper stopped", f"{row.n}:{last_seen}"):
                speaking.agent.say("stopped", n=row.n, name=row.name, cause=launch_failure(context.record.root, row.environment), rows=[row.ref])
            elif not stopped and time.time() - last_seen >= quiet_after and speaking.once("helper quiet", f"{row.n}:{last_seen}"):
                speaking.agent.say("quiet", n=row.n, name=row.name, minutes=int((time.time() - last_seen) // MINUTE))
            if not stopped:
                self.name_idle(context, speaking, row)

    def name_idle(self, context: AgentContext, speaking: AgentContext, row) -> None:
        agent = Agents(Record(context.record.root, row.environment), actor=SYSTEM).primary_to_read()
        idle = agent.idle_for if agent else 0.0
        after, every, repeats = (float(context.settings.idle_after) * MINUTE, float(context.settings.idle_every) * MINUTE, int(context.settings.idle_repeats))
        if idle < after:
            return
        notice = 1 + int((idle - after) // every) if every else 1
        if (not repeats or notice <= 1 + repeats) and speaking.once("helper idle", f"{row.n}:{agent.at}:{notice}"):
            speaking.agent.say("idle", n=row.n, name=row.name, minutes=int(idle // MINUTE))
