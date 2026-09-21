from engine.hooks import start_file
from engine.queries import start_block
from features.base import Feature, event
from resources.types import TYPES
from engine.stored import write_text


HELLO = "journal: started on {env} — say what waits"
WAIT_FOR_REPORT = 8.0
SHAPING = ("feature", "plugin", "environment")


def hello(env: str) -> str:
    return HELLO.format(env=env)


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

    @event("*")
    def write(self, event, record) -> None:
        if event.type not in TYPES or not (TYPES[event.type].handed or event.type in SHAPING):
            return
        block = start_block(record)
        for compacted in (False, True):
            f = start_file(record.root, record.env, compacted)
            f.parent.mkdir(parents=True, exist_ok=True)
            write_text(f, COMPACTED + block if compacted else block)
