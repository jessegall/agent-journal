from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.features.briefing.support.start_lines import StartLines
from journal.support.decision import Decision


class StartBriefing(AgentListener[SessionStarted]):
    """Every session start, and every resume after a compaction, tells the agent where it is and what binds it, the start block, as the engine's own: no workflow draws it, and a user's own Session start workflows run after it."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, start: StartLines) -> None:
        self.machine, self.nudger, self.start = machine, nudger, start

    def handle(self, event: SessionStarted) -> Decision | None:
        agent = self.machine.agent(event.session, event.environment_id)
        lines = [line for said in self.start.said(event) if (line := self.nudger.say(agent, said))]
        return Decision.tell("\n".join(lines)) if lines else None
