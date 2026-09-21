from engine.hooks import start_file
from engine.queries import start_block
from engine.stored import write_text

COMPACTED = """THIS WINDOW WAS JUST COMPACTED. The summary kept what was done and dropped what was decided. Before touching anything:
  journal conversation --back=1   the stretch the summary replaced
  journal user                    the user's own words, in full
  journal open                    the work still open, with its notes
  journal search <term>           before saying "we decided" or "earlier you said"
Load the journal skill again (Skill: journal); the compaction emptied it. Then carry on with the open work below.

"""


def rebuild(record) -> None:
    block = start_block(record)
    for compacted in (False, True):
        write_text(start_file(record.root, record.env, compacted), COMPACTED + block if compacted else block)
