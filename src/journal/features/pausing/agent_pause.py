from journal.engine.state_machine import StateMachine
from journal.engine.nudger import Nudger
from journal.features.pausing.states.paused_by_user import PausedByUser
from journal.models.agent import Agent
from journal.support.refused import Refused
from journal.supervisor_link import SupervisorLink


class AgentPause:
    """The user's pause of an agent: the agent finishes the step it is on and its next tool call is held; a resume puts it back where it was and tells it to carry on."""

    def __init__(self, machine: StateMachine, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.supervisor = machine, nudger, supervisor

    def pause(self, agent: Agent) -> Agent:
        current = self.machine.current(agent.session)
        if isinstance(current, PausedByUser):
            return agent
        return self.machine.move(agent.session, agent.environment_id, PausedByUser.leaving(current))

    def resume(self, agent: Agent) -> Agent:
        from journal.features.pausing.feature import PausingFeature
        current = self.machine.current(agent.session)
        if not isinstance(current, PausedByUser):
            raise Refused(f"agent {agent.id} is not paused")
        resumed = self.machine.move(agent.session, agent.environment_id, current.back().to)
        line = self.nudger.say(resumed, PausingFeature.RESUMED.create())
        if line:
            self.supervisor.type(agent.environment_id, line)
        return resumed
