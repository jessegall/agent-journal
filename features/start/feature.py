from engine.hooks import start_file
from engine.queries import start_block
from features.base import Feature, on


COMPACTED = """THIS WINDOW WAS JUST COMPACTED. The summary kept what was done and dropped what was decided. Before touching anything:
  journal conversation --back=1   the stretch the summary replaced
  journal user                    the user's own words, in full
  journal open                    the work still open, with its notes
  journal search <term>           before saying "we decided" or "earlier you said"
Load the journal skill again (Skill: journal); the compaction emptied it. Then carry on with the open work below.

"""


class Start(Feature):
    name = "start"
    title_ = "The start block"
    abstract_ = "What a session is handed at its start, kept current on every change to the record"
    help_ = "The hook hands the file over at SessionStart; nothing is computed inside the hook."

    @on("*")
    def write(self, event, record) -> None:
        block = start_block(record)
        for compacted in (False, True):
            f = start_file(record.root, record.env, compacted)
            f.parent.mkdir(parents=True, exist_ok=True)
            f.write_text(COMPACTED + block if compacted else block)
