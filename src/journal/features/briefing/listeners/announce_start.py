from journal.events.agent.journal_started import JournalStarted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.events.bus import Bus

STARTS = ("startup", "resume")
"""The sources of a session start that are a start of the journal's: a cleared or compacted conversation goes on with the same agent."""


class AnnounceStart(AgentListener[SessionStarted]):
    """Once the start block is sent, the journal says it started the agent here: the event the greeting and any workflow on the trigger listen to."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: SessionStarted) -> None:
        if event.source not in STARTS:
            return
        self.bus.dispatch(JournalStarted(source=event.source).placed(event.session, event.environment_id, event.provider, event.context, event.subagent))
