import time

from controllers.types import Agents
from engine.sessions import Sessions
from features import trigger
from features.base import Feature, event
from resources.base import SYSTEM

STOPPED = "stopped"


class SessionsFeature(Feature):
    name = "sessions"
    title_ = "Sessions"
    abstract_ = "A session evicted from its environment is held from writing, and one that went quiet without saying goodbye is marked stopped"
    help_ = "Another session claimed the environment with a reason; the hold names it. A row still saying working or idle with no word from it for sessions.quiet (minutes, 60) is marked stopped, because a session that ended without its last hook would say working for ever."
    trigger = {"every": 60, "unit": trigger.MINUTES}
    QUIET = "quiet"
    quiet = 60

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent(event, record)
        sessions = Sessions(record.root)
        gone = sessions.read(agent.title).get("evicted")
        if gone and not sessions.environment(agent.title):
            self.hold(record, f"environment {gone['environment']!r} was claimed by session {gone['by']} ({gone['why']}): switch to another, or claim it back")
        else:
            self.release(record)

    @event("agent.updated")
    def sweep(self, event, record) -> None:
        if self.due(record, self.agent(event, record)):
            self.quieted(record)

    def quieted(self, record) -> list:
        agents = Agents(record, actor=SYSTEM)
        silent = time.time() - record.setting(self.name, {}).get(self.QUIET, self.quiet) * 60
        gone = [row for row in agents.all() if row.status and row.status != STOPPED and float(row.at or 0) < silent]
        for row in gone:
            agents.stamp(row.n, status=STOPPED)
        return gone
