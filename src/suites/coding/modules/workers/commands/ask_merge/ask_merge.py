from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.merge_ask_outcome import MergeAskOutcome


@dataclass(frozen=True)
class AskMerge(Command[MergeAskOutcome]):
    """A worker asks for the merge of its committed unit, with a note of what the merge holds."""

    worker_id: int
    note: str
