from journal.events.agent.session_ended import SessionEnded
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.repositories.counts import Counts


class ForgetCountsAtEnd(AgentListener[SessionEnded]):
    """An ended session's counts are deleted: they were the agent's, and the agent is gone."""

    def __init__(self, counts: Counts) -> None:
        self.counts = counts

    def handle(self, event: SessionEnded) -> None:
        self.counts.forget(event.session, Actor.system())
