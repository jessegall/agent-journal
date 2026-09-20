from engine.sessions import Sessions
from features.base import Feature, event


class Evicted(Feature):
    name = "sessions"
    title_ = "Sessions"
    abstract_ = "A session evicted from its environment is held from writing until it switches or claims"
    help_ = "Another session claimed the environment with a reason; the hold names it."

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent(event, record)
        sessions = Sessions(record.root)
        gone = sessions.read(agent.title).get("evicted")
        if gone and not sessions.environment(agent.title):
            self.hold(record, f"environment {gone['environment']!r} was claimed by session {gone['by']} ({gone['why']}): switch to another, or claim it back")
        else:
            self.release(record)
