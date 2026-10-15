from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.idle import Idle as AgentIdle
from journal.features.agent_listener import AgentListener
from journal.features.tasks.stop_words import StopWords
from journal.supervisor_link import SupervisorLink


class TypeAtHeldStop(AgentListener[AgentIdle]):
    """A stop the journal cannot hold, one that follows a held stop with no work between, still gets its words: typed into the terminal, so the agent carries on. A halt with a reason is the way out."""

    def __init__(self, machine: Machine, nudger: Nudger, words: StopWords, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.words, self.supervisor = machine, nudger, words, supervisor

    def handle(self, event: AgentIdle) -> None:
        if not event.again:
            return
        agent = self.machine.agent(event.session, event.environment_id)
        said = self.words.for_(self.machine.states.named(agent.state, agent.data), event.environment_id)
        line = self.nudger.say(agent, said) if said else None
        if line:
            self.supervisor.type(event.environment_id, line)
