from engine.markers import marked
from events.agents import AgentMessageSent
from expects import Changed, Given, Nudged, Unchanged, answering
from features.base import Feature
from features.journal import Journal
from features.row_links.details import RowLinksDetails
from features.row_links.formatters import MarkRows, UnwrapChips
from features.row_links.paths import MarkPaths
from features.row_links.handlers import NameAmbiguousFiles
from resources.types import AgentRow, Todo


AGENT_ROW = AgentRow(n=1, title="claude-1")
TWO_HELPERS = answering({"src/a/helpers.py": "", "src/b/helpers.py": ""})


def said(text: str) -> AgentMessageSent:
    return AgentMessageSent(agent=1, text=text, turn="turn-1")


SEVEN = Todo(n=7, title="Close the old to-do")
CHIP = marked("chip", "todo:7", "to-do 7")


class RowLinks(Feature):
    details = RowLinksDetails

    def register(self, journal: Journal) -> None:
        journal.client.formatter(MarkRows(), expects=[
            Given("I closed to-do 7 for you", rows=[SEVEN]) >> Changed(f"I closed {CHIP} for you"),
            Given("I closed to-do 9 for you", rows=[SEVEN]) >> Changed("I closed to-do 9 for you"),
            Given("I closed `to-do 7` for you", rows=[SEVEN]) >> Changed(f"I closed {CHIP} for you"),
            Given("Run `journal todo done 7` now", rows=[SEVEN]) >> Changed("Run `journal todo done 7` now"),
            Given("Nothing numbered here", rows=[SEVEN]) >> Changed("Nothing numbered here"),
        ])
        journal.client.formatter(MarkPaths(), expects=[
            Given("Nothing to link here") >> Changed("Nothing to link here"),
        ])
        journal.client.formatter(UnwrapChips(), expects=[
            Given(f"I closed ({CHIP}) for you") >> Changed(f"I closed {CHIP} for you"),
            Given(f"I closed {CHIP} for you") >> Changed(f"I closed {CHIP} for you"),
            Given("I closed (the old one) for you") >> Changed("I closed (the old one) for you"),
        ])
        journal.events.handler(NameAmbiguousFiles(), expects=[
            Given(said("Edit helpers.py next"), rows=[AGENT_ROW], files=TWO_HELPERS) >> Nudged("ambiguous", name="helpers.py"),
            Given(said("Edit helpers.py next"), rows=[AGENT_ROW], files=answering({"src/a/helpers.py": ""})) >> Unchanged(),
            Given(said("Edit another.py next"), rows=[AGENT_ROW], files=TWO_HELPERS) >> Unchanged(),
            Given(said("Nothing to name here"), rows=[AGENT_ROW], files=TWO_HELPERS) >> Unchanged(),
        ])
