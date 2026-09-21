from engine.hooks import start_file
from engine.queries import start_block
from features.base import Feature, Line, event
from resources.types import TYPES
from engine.stored import write_text


SHAPING = ("feature", "plugin", "environment")


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
    help_ = "The hook hands the file over at SessionStart; nothing is computed inside the hook. The first time a session starts, the journal types a line into the agent's terminal, never the channel, asking it to say something in the chat so the journal's messages reach it."
    lines = {"ready": Line("the journal is ready on {{env}}", "say hello in the chat, so the journal's messages reach you")}

    @event("agent.updated")
    def greet(self, event, record) -> None:
        agent = self.agent(event, record)
        if not agent or agent.event != "SessionStart":
            return
        if not self.already(record, agent.title, "greeted", "ready"):
            self.journal.type(record, agent, "ready", env=record.env)


    @event("*")
    def write(self, event, record) -> None:
        if event.type in TYPES and (TYPES[event.type].start_heading or event.type in SHAPING):
            self.rebuild(record)

    def rebuild(self, record) -> None:
        block = start_block(record)
        for compacted in (False, True):
            f = start_file(record.root, record.env, compacted)
            write_text(f, COMPACTED + block if compacted else block)
