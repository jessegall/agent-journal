from controllers.types import Environments
from features.session_briefing.start import start_block
from resources.base import SYSTEM
from resources.files import start_name

COMPACTED = """THIS WINDOW WAS JUST COMPACTED. The summary kept what was done and dropped what was decided. Before touching anything:
  journal message recent          the latest messages, yours and the user's, in full
  journal conversation --back=1   the stretch the summary replaced
  journal user                    the user's own words, in full
  journal open                    the work still open, with its notes
  journal search <term>           before saying "we decided" or "earlier you said"
Load the journal skill again (Skill: journal); the compaction emptied it. Then carry on with the open work below.

"""


def outdated(record, journal_root, compacted: bool) -> bool:
    """Whether the start block of this environment is missing or older than the last session it moved past."""
    path = start_name(record.env, compacted)
    return not journal_root.is_file(path) or journal_root.modified(path) < retirement(record)


def briefing(record, journal_root, compacted: bool) -> str:
    """The start block a new session reads: the file when it is up to date, else the block as it would be written."""
    return block_for(record, compacted) if outdated(record, journal_root, compacted) else journal_root.read(start_name(record.env, compacted))


def block_for(record, compacted: bool) -> str:
    block = start_block(record)
    return COMPACTED + block if compacted else block


def retirement(record) -> float:
    """When this environment last moved past a session, which is the one change the block must carry before a new session reads it."""
    return Environments(record, actor=SYSTEM).retired_in(record.env).retired.get("at", 0.0)


def rebuild(record, journal_root) -> None:
    for compacted in (False, True):
        path, text = start_name(record.env, compacted), block_for(record, compacted)
        if not journal_root.is_file(path) or journal_root.read(path) != text:
            journal_root.write(path, text)
