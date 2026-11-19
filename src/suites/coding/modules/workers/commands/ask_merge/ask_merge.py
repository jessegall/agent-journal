from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.merge_ask_outcome import MergeAskOutcome
from suites.coding.modules.workers.support.merge_ask_part import MergeAskPart


@dataclass(frozen=True)
class AskMerge(Command[MergeAskOutcome]):
    """A worker asks for the merge of its committed unit, whole or up to one task or commit, with a note of what
    the merge holds. The part it asks for is checked before this write, as the check reads git."""

    lock = True

    worker_id: int
    note: str
    part: MergeAskPart
