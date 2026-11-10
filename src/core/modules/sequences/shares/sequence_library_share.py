from dataclasses import asdict

from engine.actor.actor import CORE_ACTOR_ID
from engine.command.context import Context
from core.base.library.library_share import Fields, LibraryShare
from engine.repository.repository import Repository
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.queries.sequence_query import EMPTY_TRIGGERS
from core.modules.sequences.shares.sequence_columns import SequenceColumns



class SequenceLibraryShare(LibraryShare[Sequence]):
    """A sequence is sent as its title, steps and what each step holds back. What starts it on its own never
    travels. New steps wait while a run of it is going, since a run counts its place in the steps, and they
    wait for a person when local triggers would start them with nobody looking."""

    name = "sequence"
    model = Sequence

    def __init__(self, repository: Repository, runs: SequenceRunQuery) -> None:
        self.repository, self.runs = repository, runs

    def fields(self, row: Sequence) -> Fields:
        return {"title": row.title, "steps": row.steps_text, "step_guards": row.guards_text}

    def arrive(self, fields: Fields, context: Context) -> Sequence:
        return self.repository.save(Sequence(creator_id=context.actor.id, **asdict(SequenceColumns.parsed(fields))), context)

    def follow(self, row: Sequence, fields: Fields, context: Context) -> Sequence:
        return self.repository.update(row, context, **asdict(SequenceColumns.parsed(fields)))

    def is_paused(self, row: Sequence) -> bool:
        return self.runs.has_open_run(row.id)

    def needs_reading(self, row: Sequence, fields: Fields) -> str:
        steps_changed = row.steps_text != fields["steps"] or row.guards_text != fields["step_guards"]
        return "The steps of this sequence changed." if steps_changed and row.triggers != EMPTY_TRIGGERS else ""

    def share_refusal(self, row: Sequence) -> str:
        return "this comes with the journal" if row.creator_id == CORE_ACTOR_ID else ""
