from datetime import datetime, timedelta, timezone

from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.features.registry import Registry
from journal.support.running import Running
from journal.repositories.questions import Questions
from journal.repositories.settings import Settings
from journal.supervisor_link import SupervisorLink

QUIET_FOR = 60.0
"""Seconds the agent must have been quiet before a step is typed to it, so a line never lands mid-turn."""
WAITING_SLOWER = 3
"""How many times longer a step stands before it is said again while the agent waits."""


class SayTheStepAtAPace(AgentListener[Ticked]):
    """A step unheard for the set minutes is typed again to a quiet agent, three times as slow while the agent waits; nothing is said for a parked run or while a question to the user is open."""

    def __init__(self, machine: Machine, running: Running, settings: Settings, questions: Questions, registry: Registry, supervisor: SupervisorLink) -> None:
        self.machine, self.running, self.settings, self.questions, self.registry, self.supervisor = machine, running, settings, questions, registry, supervisor

    def handle(self, event: Ticked) -> None:
        run = self.running.in_hand(event.session, event.environment_id)
        if run is None or run.parked_why or self.questions.open() or event.quiet_for < QUIET_FOR or not self.running.typed_to(event.session, event.environment_id):
            return
        if datetime.now(timezone.utc) - datetime.fromisoformat(run.said_at) < self.pace(event):
            return
        said = self.running.reminder(run)
        if not self.registry.silenced(said):
            self.running.said_now(event.session, event.environment_id)
            self.supervisor.type(event.environment_id, said.rendered())

    def pace(self, event: Ticked) -> timedelta:
        from journal.features.sequences.feature import Sequences
        minutes = float(self.settings.option(Sequences.SAY_EVERY))
        return timedelta(minutes=minutes * (WAITING_SLOWER if isinstance(self.machine.current(event.session), Paused) else 1))
