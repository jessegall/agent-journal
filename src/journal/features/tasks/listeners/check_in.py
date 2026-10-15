from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.ticked import Ticked
from journal.features.agent_listener import AgentListener
from journal.features.tasks.states.idle import Idle
from journal.repositories.settings import PROJECT, Settings
from journal.supervisor_link import SupervisorLink

EVERY = 1800.0


class CheckIn(AgentListener[Ticked]):
    """In auto mode, an agent idle for half an hour is asked whether anything is left for it to do."""

    def __init__(self, machine: Machine, nudger: Nudger, settings: Settings, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.settings, self.supervisor = machine, nudger, settings, supervisor

    def handle(self, event: Ticked) -> None:
        from journal.features.tasks.feature import Tasks
        from journal.features.tasks.listeners.offer_next import AUTO
        if event.quiet_for < EVERY or not self.settings.get(PROJECT, AUTO, True):
            return
        agent = self.machine.agent(event.session, event.environment_id)
        if not isinstance(self.machine.states.named(agent.state, agent.data), Idle):
            return
        line = self.nudger.say(agent, Tasks.CHECK_IN.about(minutes=int(event.quiet_for // 60)))
        if line:
            self.supervisor.type(event.environment_id, line)
