from resources.markers import marked
from events.agents import AgentMessageSent
from events.answers import Allowed, Rewritten
from events.asking import TextFormatting
from expects import Answered, Dispatches, Given, Nudged, answering, nothing
from framework.format import SHARED, VIEWER
from framework.base import Feature
from framework.journal import Journal
from features.row_links.details import RowLinksDetails
from features.row_links.formatters import MarkRows, UnwrapChips
from features.row_links.paths import MarkPaths
from features.row_links.handlers import NameAmbiguousFiles
from features.row_links.listeners import SpotAmbiguousFiles
from events.row_links import AmbiguousFileNamed
from resources.types import AgentRow, Todo


AGENT_ROW = AgentRow(n=1, title="claude-1")
TWO_HELPERS = answering({"src/a/helpers.py": "", "src/b/helpers.py": ""})


def shown(text: str, surface: str = VIEWER) -> TextFormatting:
    return TextFormatting(text=text, surface=surface)


def said(text: str) -> AgentMessageSent:
    return AgentMessageSent(agent=1, text=text, turn="turn-1")


SEVEN = Todo(n=7, title="Close the old to-do")
EIGHT = Todo(n=8, title="Open the new to-do")
X = answering({"src/a/x.py": ""})
CHIP = marked("chip", "todo:7", "to-do 7")


class RowLinks(Feature):
    details = RowLinksDetails

    def register(self, journal: Journal) -> None:
        journal.events.answer(TextFormatting, MarkRows(), expects=[
            Given(shown("I closed to-do 7 for you"), rows=[SEVEN]) >> Answered(Rewritten(f"I closed {CHIP} for you")),
            Given(shown("I closed to-dos 7 and 8 for you"), rows=[SEVEN, EIGHT]) >> Answered(Rewritten(f"I closed {CHIP} and {marked('chip', 'todo:8', 'to-do 8')} for you")),
            Given(shown("ik heb taak 7 en 8 gesloten"), rows=[SEVEN, EIGHT])
                >> Answered(Rewritten(f"ik heb {marked('chip', 'todo:7', 'taak 7')} en {marked('chip', 'todo:8', 'taak 8')} gesloten")),
            Given(shown("I closed to-dos 7 and 9 for you"), rows=[SEVEN]) >> Answered(Rewritten("I closed to-dos 7 and 9 for you")),
            Given(shown("I closed to-do 7 for you", SHARED), rows=[SEVEN]) >> Answered(Rewritten(f"I closed {CHIP} for you")),
            Given(shown("I closed to-do 7 for you", "chat"), rows=[SEVEN]) >> Answered(Allowed()),
            Given(shown("I closed to-do 9 for you"), rows=[SEVEN]) >> Answered(Rewritten("I closed to-do 9 for you")),
            Given(shown("I closed `to-do 7` for you"), rows=[SEVEN]) >> Answered(Rewritten(f"I closed {CHIP} for you")),
            Given(shown("Run `journal todo done 7` now"), rows=[SEVEN]) >> Answered(Rewritten("Run `journal todo done 7` now")),
            Given(shown("Nothing numbered here"), rows=[SEVEN]) >> Answered(Allowed()),
        ])
        journal.events.answer(TextFormatting, MarkPaths(), expects=[
            Given(shown("Nothing to link here")) >> Answered(Allowed()),
            Given(shown("See https://example.com/page now")) >> Answered(Rewritten(f"See {marked('url', 'https://example.com/page', 'https://example.com/page')} now")),
            Given(shown("See https://example.com/page now", SHARED)) >> Answered(Allowed()),
            Given(shown("See src/a/x.py now"), files=X) >> Answered(Rewritten(f"See {marked('file', 'src/a/x.py', 'x.py')} now")),
            Given(shown("See src/a/x.py:12 now"), files=X) >> Answered(Rewritten(f"See {marked('file', 'src/a/x.py#L12', 'x.py:12')} now")),
            Given(shown("Open `src/a/x.py` now"), files=X) >> Answered(Rewritten(f"Open {marked('file', 'src/a/x.py', 'x.py')} now")),
            Given(shown("Open `src/a/gone.py` now"), files=X) >> Answered(Rewritten("Open `src/a/gone.py` now")),
            Given(shown("Fixed in abc1234def today")) >> Answered(Rewritten(f"Fixed in {marked('commit', 'abc1234def', 'abc1234')} today")),
            Given(shown("Seen 1234567 times")) >> Answered(Rewritten("Seen 1234567 times")),
        ])
        journal.events.answer(TextFormatting, UnwrapChips(), expects=[
            Given(shown(f"I closed ({CHIP}) for you")) >> Answered(Rewritten(f"I closed {CHIP} for you")),
            Given(shown(f"I closed {CHIP} for you")) >> Answered(Rewritten(f"I closed {CHIP} for you")),
            Given(shown("I closed (the old one) for you")) >> Answered(Rewritten("I closed (the old one) for you")),
        ])
        journal.events.listen(AgentMessageSent, SpotAmbiguousFiles(), expects=[
            Given(said("Edit helpers.py next"), rows=[AGENT_ROW], files=TWO_HELPERS)
                >> Dispatches(AmbiguousFileNamed(name="helpers.py", count=2, paths="src/a/helpers.py, src/b/helpers.py").once("ambiguous|1|helpers.py")),
            Given(said("Edit helpers.py next"), rows=[AGENT_ROW], files=answering({"src/a/helpers.py": ""})) >> Dispatches(nothing),
            Given(said("Edit another.py next"), rows=[AGENT_ROW], files=TWO_HELPERS) >> Dispatches(nothing),
            Given(said("Nothing to name here"), rows=[AGENT_ROW], files=TWO_HELPERS) >> Dispatches(nothing),
        ])
        journal.events.handle(AmbiguousFileNamed, NameAmbiguousFiles(), expects=[
            Given(AmbiguousFileNamed(name="helpers.py", count=2, paths="src/a/helpers.py, src/b/helpers.py"), rows=[AGENT_ROW]) >> Nudged("ambiguous", name="helpers.py"),
        ])
