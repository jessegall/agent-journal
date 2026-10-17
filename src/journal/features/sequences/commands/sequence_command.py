from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.features.sequences.running import Running
from journal.models.sequence import Sequence
from journal.repositories.scope import Scope
from journal.models.sequence_run import SequenceRun
from journal.refused import Refused
from journal.repositories.sequences import Sequences


class SequenceCommand(Command):
    noun = "sequence"

    def __init__(self, sequences: Sequences, running: Running, scope: Scope) -> None:
        self.sequences, self.running, self.scope = sequences, running, scope

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "write a sequence of steps")
        create.add_argument("--starts-on", default="", help="the row event that starts it on its own, as kind.created, such as plan.created")
        create.add_argument("title")
        create.add_argument("--steps", required=True, help="steps separated by |")
        self.verb(verbs, "run", "start a sequence at its first step").add_argument("n", type=int)
        self.verb(verbs, "follow", "take the step in hand up, and resume a parked run")
        self.verb(verbs, "next", "the step in hand is done; the next one, or the end")
        self.verb(verbs, "park", "set the run aside, its holds quiet until it is followed again").add_argument("--why", required=True)
        self.verb(verbs, "list", "every sequence")

    def create(self, args: Namespace, where: Where) -> int:
        steps = tuple(s.strip() for s in args.steps.split("|") if s.strip())
        sequence = self.sequences.save(Sequence(title=args.title, steps=steps, starts_on=args.starts_on), where.actor)
        print(f"sequence {sequence.id}: {sequence.title}, {len(steps)} steps")
        return 0

    def run(self, args: Namespace, where: Where) -> int:
        sequence = self.sequences.find(args.n)
        print(self.running.start(sequence, where.session, self.scope.id) or f"sequence {sequence.id} is running already")
        return 0

    def follow(self, args: Namespace, where: Where) -> int:
        self.in_hand(where)
        from journal.features.sequences.feature import Sequences
        run = self.running.follow(where.session, self.scope.id)
        print(Sequences.FOLLOWING.about(n=run.sequence_id, step=run.step + 1, text=run.text).rendered())
        return 0

    def next(self, args: Namespace, where: Where) -> int:
        run = self.in_hand(where)
        if not run.taken_up_at:
            raise Refused(f"step {run.step + 1} of sequence {run.sequence_id} was never taken up: `journal sequence follow` first")
        print(self.running.next(where.session, self.scope.id))
        return 0

    def park(self, args: Namespace, where: Where) -> int:
        self.in_hand(where)
        run = self.running.park(where.session, self.scope.id, args.why)
        print(f"sequence {run.sequence_id} parked at step {run.step + 1}: {args.why}. `journal sequence follow` resumes it")
        return 0

    def in_hand(self, where: Where) -> SequenceRun:
        run = self.running.in_hand(where.session, self.scope.id)
        if run is None:
            raise Refused("no sequence is running")
        return run

    def list(self, args: Namespace, where: Where) -> int:
        for sequence in self.sequences.all():
            starts = f", starts on {sequence.starts_on}" if sequence.starts_on else ""
            print(f"{sequence.id:>4}  {sequence.title} ({len(sequence.steps)} steps{starts})")
        return 0
