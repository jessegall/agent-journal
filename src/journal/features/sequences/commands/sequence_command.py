from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.sequences.states.running_sequence import RunningSequence
from journal.models.sequence import Sequence
from journal.repositories.environments import Environments
from journal.repositories.sequences import Sequences


class SequenceCommand(Command):
    noun = "sequence"

    def __init__(self, sequences: Sequences, environments: Environments, machine: Machine) -> None:
        self.sequences, self.environments, self.machine = sequences, environments, machine

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "write a sequence of steps")
        create.add_argument("title")
        create.add_argument("--steps", required=True, help="steps separated by |")
        self.verb(verbs, "run", "start a sequence at its first step").add_argument("n", type=int)
        self.verb(verbs, "next", "the step in hand is done; the next one, or the end")
        self.verb(verbs, "list", "every sequence")

    def create(self, args: Namespace, where: Where) -> int:
        steps = tuple(s.strip() for s in args.steps.split("|") if s.strip())
        sequence = self.sequences.save(Sequence(title=args.title, steps=steps), where.actor)
        print(f"sequence {sequence.id}: {sequence.title}, {len(steps)} steps")
        return 0

    def run(self, args: Namespace, where: Where) -> int:
        from journal.features.sequences.feature import Sequences as SequencesFeature
        sequence = self.sequences.find(args.n)
        environment = self.environments.named(where.environment).id
        agent = self.machine.agent(where.session, environment)
        current = self.machine.states.named(agent.state, agent.data)
        self.machine.move(where.session, environment, RunningSequence.leaving(current, sequence_id=sequence.id, step=0, text=sequence.steps[0]))
        print(SequencesFeature.STEP.about(n=sequence.id, step=1, text=sequence.steps[0]).rendered())
        return 0

    def next(self, args: Namespace, where: Where) -> int:
        from journal.features.sequences.feature import Sequences as SequencesFeature
        environment = self.environments.named(where.environment).id
        agent = self.machine.agent(where.session, environment)
        state = self.machine.states.named(agent.state, agent.data)
        if not isinstance(state, RunningSequence):
            print("no sequence is running")
            return 1
        sequence = self.sequences.find(state.sequence_id)
        step = state.step + 1
        if step >= len(sequence.steps):
            self.machine.move(where.session, environment, state.back().to)
            print(SequencesFeature.ENDED.about(n=sequence.id).rendered())
            return 0
        self.machine.move(where.session, environment, state.with_step(step, sequence.steps[step]))
        print(SequencesFeature.STEP.about(n=sequence.id, step=step + 1, text=sequence.steps[step]).rendered())
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for sequence in self.sequences.all():
            print(f"{sequence.id:>4}  {sequence.title} ({len(sequence.steps)} steps)")
        return 0
