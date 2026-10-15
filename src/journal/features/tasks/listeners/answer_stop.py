from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.idle import Idle as AgentIdle
from journal.features.agent_listener import AgentListener
from journal.features.tasks.states.working import Working
from journal.features.tasks.stop_words import StopWords
from journal.hooks.decision import Decision


class AnswerStop(AgentListener[AgentIdle]):
    """A stop with nothing in hand is held once with what the journal has to say: parked tasks in any mode, the next open task in auto mode. The task in hand speaks for itself."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, words: StopWords) -> None:
        self.machine, self.nudger, self.words = machine, nudger, words

    def handle(self, event: AgentIdle) -> Decision | None:
        agent = self.machine.agent(event.session, event.environment_id)
        state = self.machine.states.named(agent.state, agent.data)
        said = None if event.again or isinstance(state, Working) else self.words.for_(state, event.environment_id)
        line = self.nudger.say(agent, said) if said else None
        return Decision.refuse(line) if line else None
