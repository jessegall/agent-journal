from argparse import Namespace
from journal.models.support.ref import Ref

from journal.console.command import Command
from journal.support.caller import Caller
from journal.chat.moment_cards import MomentCards
from journal.features.sequences.support.run_tracker import RunTracker
from journal.models.sequence import Sequence
from journal.repositories.scope import Scope
from journal.support.sequence_run import SequenceRun
from journal.support.rejection import Rejection
from journal.repositories.sequences import Sequences
from journal.support.card_kind import CardKind


class SequenceCommand(Command):
    noun = "sequence"

    def __init__(self, sequences: Sequences, active: RunTracker, scope: Scope, cards: MomentCards) -> None:
        self.sequences, self.running, self.scope, self.cards = sequences, active, scope, cards

    def arguments(self, verbs) -> None:
        creation = self.verb(verbs, "create", "write a sequence of steps")
        creation.add_argument("--starts-on", default="", help="the row event that starts it on its own, as kind.created, such as plan.created")
        creation.add_argument("title")
        creation.add_argument("--steps", required=True, help="steps separated by |")
        self.verb(verbs, "run", "start a sequence at its first step").add_argument("n", type=int)
        self.verb(verbs, "follow", "take the step in hand up, and resume a parked run")
        self.verb(verbs, "next", "the step in hand is done; the next one, or the end")
        self.verb(verbs, "suspend", "set the run aside, its holds quiet until it is followed again").add_argument("--why", required=True)
        abandon = self.verb(verbs, "abandon", "give the run up, its remaining steps undone; the user is told")
        abandon.add_argument("--why", required=True)
        abandon.add_argument("--sure", action="store_true", help="go through, once the steps it skips are read")
        self.verb(verbs, "list", "every sequence")

    def create(self, args: Namespace, caller: Caller) -> int:
        steps = tuple(s.strip() for s in args.steps.split("|") if s.strip())
        sequence = self.sequences.save(Sequence(title=args.title, steps=steps, trigger_event=args.starts_on), caller.actor)
        print(f"sequence {sequence.id}: {sequence.title}, {len(steps)} steps")
        return 0

    def run(self, args: Namespace, caller: Caller) -> int:
        sequence = self.sequences.find(args.n)
        print(self.running.start(sequence, caller.agent_session, self.scope.id) or f"sequence {sequence.id} is running already")
        return 0

    def follow(self, args: Namespace, caller: Caller) -> int:
        self.current_run(caller)
        from journal.features.sequences.feature import Sequences
        run = self.running.follow(caller.agent_session, self.scope.id)
        print(Sequences.CURRENT_STEP.create(n=run.sequence_id, step=run.step + 1, text=run.text).rendered())
        return 0

    def next(self, args: Namespace, caller: Caller) -> int:
        run = self.current_run(caller)
        if not run.adopted_at:
            raise Rejection(f"step {run.step + 1} of sequence {run.sequence_id} was never taken up: `journal sequence follow` first")
        print(self.running.next(caller.agent_session, self.scope.id))
        return 0

    def suspend(self, args: Namespace, caller: Caller) -> int:
        self.current_run(caller)
        run = self.running.suspend(caller.agent_session, self.scope.id, args.why)
        print(f"sequence {run.sequence_id} parked at step {run.step + 1}: {args.why}. `journal sequence follow` resumes it")
        return 0

    def abandon(self, args: Namespace, caller: Caller) -> int:
        run = self.current_run(caller)
        if not run.adopted_at:
            raise Rejection(f"step {run.step + 1} of sequence {run.sequence_id} was never taken up: `journal sequence follow` first, then abandon it if it cannot be done")
        skipped = "; ".join(f"{run.step + i + 1}. {text}" for i, text in enumerate(run.skipped))
        if not args.sure:
            raise Rejection(f"abandoning sequence {run.sequence_id}, {run.title}, leaves undone: {skipped}. again with --sure to go through")
        run, line = self.running.abandon(caller.agent_session, self.scope.id)
        self.cards.show(self.scope.id, caller.agent_session, f"Sequence {run.sequence_id}, {run.title}, abandoned at step {run.step + 1}: {args.why}", "bolt", "bad", f"left undone: {skipped}", Ref("sequences", run.sequence_id), shows=CardKind.SEQUENCES)
        print(line)
        return 0

    def current_run(self, caller: Caller) -> SequenceRun:
        run = self.running.current(caller.agent_session, self.scope.id)
        if run is None:
            raise Rejection("no sequence is running")
        return run

    def list(self, args: Namespace, caller: Caller) -> int:
        for sequence in self.sequences.all():
            starts = f", starts on {sequence.trigger_event}" if sequence.trigger_event else ""
            print(f"{sequence.id:>4}  {sequence.title} ({len(sequence.steps)} steps{starts})")
        return 0
