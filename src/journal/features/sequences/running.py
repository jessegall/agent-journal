from journal.engine.machine import Machine
from journal.features.sequences.states.running_sequence import RunningSequence
from journal.models.sequence import Sequence


class Running:
    """Starting a sequence for an agent: its state goes to the first step, kept under the state it was in, and the first step is the line to tell it."""

    def __init__(self, machine: Machine) -> None:
        self.machine = machine

    def start(self, sequence: Sequence, session: str, environment_id: int) -> str:
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        current = self.machine.states.named(agent.state, agent.data)
        self.machine.move(session, environment_id, RunningSequence.leaving(current, sequence_id=sequence.id, step=0, text=sequence.steps[0]))
        return Sequences.STEP.about(n=sequence.id, step=1, text=sequence.steps[0]).rendered()

    def runs_one(self, session: str, environment_id: int) -> bool:
        agent = self.machine.agent(session, environment_id)
        return isinstance(self.machine.states.named(agent.state, agent.data), RunningSequence)
