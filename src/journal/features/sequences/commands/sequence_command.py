from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.sequences.running import Running
from journal.features.sequences.states.running_sequence import RunningSequence
from journal.models.sequence import Sequence
from journal.repositories.scope import Scope
from journal.repositories.sequences import Sequences


class SequenceCommand(Command):
    noun = "sequence"

    def __init__(self, sequences: Sequences, machine: Machine, running: Running, scope: Scope) -> None:
        self.sequences, self.machine, self.running, self.scope = sequences, machine, running, scope

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "write a sequence of steps")
        create.add_argument("--starts-on", default="", help="the row event that starts it on its own, as kind.created, such as plan.created")
        create.add_argument("title")
        create.add_argument("--steps", required=True, help="steps separated by |")
        self.verb(verbs, "run", "start a sequence at its first step").add_argument("n", type=int)
        self.verb(verbs, "next", "the step in hand is done; the next one, or the end")
        self.verb(verbs, "list", "every sequence")

    def create(self, args: Namespace, where: Where) -> int:
        steps = tuple(s.strip() for s in args.steps.split("|") if s.strip())
        sequence = self.sequences.save(Sequence(title=args.title, steps=steps, starts_on=args.starts_on), where.actor)
        print(f"sequence {sequence.id}: {sequence.title}, {len(steps)} steps")
        return 0

    def run(self, args: Namespace, where: Where) -> int:
        print(self.running.start(self.sequences.find(args.n), where.session, self.scope.id))
        return 0

    def next(self, args: Namespace, where: Where) -> int:
        from journal.features.sequences.feature import Sequences as SequencesFeature
        environment = self.scope.id
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
            starts = f", starts on {sequence.starts_on}" if sequence.starts_on else ""
            print(f"{sequence.id:>4}  {sequence.title} ({len(sequence.steps)} steps{starts})")
        return 0
