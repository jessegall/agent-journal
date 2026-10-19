from datetime import datetime

from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.events.agent.idle import Idle
from journal.events.agent_listener import AgentListener
from journal.features.registry import Registry
from journal.support.running import Running
from journal.support.requiring import Requiring
from journal.support.decision import Decision
from journal.support.sequence_run import SequenceRun
from journal.repositories.entries import Entries
from journal.repositories.questions import Questions


class SayTheStepAtAStop(AgentListener[Idle]):
    """A stop while a sequence runs is held with the step in hand, unless it was said since the agent last used a tool; quiet in a wait, while a question to the user is open, while the run is parked and while the agent owes the journal something."""

    blocking = True

    def __init__(self, machine: Machine, running: Running, questions: Questions, entries: Entries, requiring: Requiring, registry: Registry) -> None:
        self.machine, self.running, self.questions, self.entries, self.requiring, self.registry = machine, running, questions, entries, requiring, registry

    def handle(self, event: Idle) -> Decision | None:
        run = self.running.in_hand(event.session, event.environment_id)
        if run is None or run.parked_why or self.quiet(event, run):
            return None
        said = self.running.step(run)
        if self.registry.silenced(said):
            return None
        self.running.said_now(event.session, event.environment_id)
        return Decision.refuse(said.rendered())

    def quiet(self, event: Idle, run: SequenceRun) -> bool:
        return isinstance(self.machine.current(event.session), Paused) or bool(self.questions.open()) or self.requiring.owes_anything(self.machine.agent(event.session, event.environment_id)) or self.held_since_last_use(event, run)

    def held_since_last_use(self, event: Idle, run: SequenceRun) -> bool:
        if not run.said_at:
            return False
        uses = self.entries.tool_starts(event.session, last=1)
        return not uses or uses[0].created_at <= datetime.fromisoformat(run.said_at)
