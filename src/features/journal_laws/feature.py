import json

from agents.terminal import OUTPUT_LINES
from controllers.types import Outputs
from resources.runs import SHELL
from events.agents import AgentMessageSent, ToolCallAnswered, ToolFinished
from events.answers import Allowed, Refused
from events.asking import AgentDispatching, ToolCallAsked
from events.journal_laws import LargerResult, LawMentioned, LongReadRefused
from expects import Answered, Dispatches, Given, Nudged, Refused as Failed, Remembered, Updated, answering, nothing
from features.journal_laws.answering import EnforceDispatchLaw, RefuseWholeLongReads
from features.journal_laws.briefing import brief, long_briefings
from features.journal_laws.commands import Keep
from features.journal_laws.details import LARGEST_RESULT, TOO_LONG, LawDetails
from features.journal_laws.handlers import MarkTheRefusedRead, NameTheLargestResult, RepeatTheLaw
from features.journal_laws.laws import carry, laws_for
from features.journal_laws.listeners import SpotLargerResult, SpotLawInCall, SpotLawInChat, SpotLongReadRefused
from features.session_briefing.start import LAW, START_PARTS
from framework.work_mode import CARRIED_IN
from framework.base import Feature
from framework.journal import Journal
from framework.recital import WHISPERED_LAW
from framework.sending import Nudge
from resources.types import AgentRow
from resources.voices import BUTLER

__all__ = ["Outputs"]

LAWS = {law.name: law for law in laws_for(BUTLER)}
NAMING = BUTLER.naming
OFF = {".journal_laws.whisper": False}
LONG = {"long.py": "x = 1\n" * 800}
RANGE = "read a range (offset 1, limit 120)"


def mention(law: str, agent: int = 1) -> LawMentioned:
    return LawMentioned(agent=agent, law=law, text=LAWS[law].text).once(f"{agent}|law:{law}:{LAWS[law].text}|{LAWS[law].reason}")


def dispatch(kind: str = "Plan", model: str = "sonnet", models: tuple[str, ...] = ("sonnet", "haiku"), description: str = "Dr. Einstein: profile the build", **more) -> AgentDispatching:
    return AgentDispatching(kind=kind, model=model, model_supported=True, models=models, name_supported=True, description=description, session="claude-1", **more)


def called(tool: str, input: str, why: str = "", subagent: bool = False) -> ToolCallAnswered:
    writings = () if tool == SHELL else tuple(value for key, value in json.loads(input).items() if key == "new_string")
    return ToolCallAnswered(agent=1, tool=tool, input=input, command=input if tool == SHELL else "", why=why, subagent=subagent, writings=writings)


def reading(tool: str, **given) -> ToolCallAsked:
    return ToolCallAsked(tool=tool, input=given["command"] if tool == "Bash" else json.dumps(given, sort_keys=True), session="claude-1")


def whole_refusal(named: str, count: int, instead: str) -> str:
    return (f"{named} has {count:,} lines, too long to read whole (law L3, read narrowly). Instead: {instead}, then the next range; "
            f"or list its headings first with grep -n '^#' {named} and read only the part you need; or grep -n for the line you want.")


READ_REFUSED = whole_refusal("long.py", 800, RANGE)
CAT_REFUSED = whole_refusal("long.py", 800, "print a range: sed -n '1,120p' long.py")


class JournalLaws(Feature):
    details = LawDetails
    nudges = (Nudge(TOO_LONG, behaviour=TOO_LONG, about=long_briefings,
                    guarantee="When a briefing file has grown longer than the agent's provider will read, the agent is told which file and by how much."),)

    def register(self, journal: Journal) -> None:
        journal.commands.add("output", Keep(), expects=[
            Given((Outputs, "output.txt", "", "nobody")) >> Failed("no such provider: nobody"),
        ])
        START_PARTS.add(self, carry, key=LAW)
        if brief not in CARRIED_IN.each():
            CARRIED_IN.add(self, brief)
        if output_lines not in OUTPUT_LINES:
            OUTPUT_LINES.append(output_lines)
        journal.events.answer(AgentDispatching, EnforceDispatchLaw(), expects=[
            Given(dispatch(kind="general-purpose")) >> Answered(Refused("Journal law L2 refuses generic subagents. Choose a specific agent type or give the dispatch a concrete task name and bounded assignment.")),
            Given(dispatch(kind="", task="general", model="gpt-5.6-luna", models=())) >> Answered(Refused("Journal law L2 refuses generic subagents. Choose a specific agent type or give the dispatch a concrete task name and bounded assignment.")),
            Given(dispatch(model="")) >> Answered(Refused("Journal law L1 requires an explicit model on every subagent dispatch. Choose the least expensive model that reliably fits the work.")),
            Given(dispatch(kind="", task="search_history", model="", models=())) >> Answered(Refused("Journal law L1 requires an explicit model on every subagent dispatch. Choose the least expensive model that reliably fits the work.")),
            Given(dispatch(model="gpt-9")) >> Answered(Refused("gpt-9 is not a model this account offers. Choose one of sonnet, haiku.")),
            Given(dispatch(model="gpt-5-mini", models=("gpt-5.6-luna", "gpt-6-sol"), description="Ada Lovelace: review plan 6"))
                >> Answered(Refused("gpt-5-mini is not a model this account offers. Choose one of gpt-5.6-luna, gpt-6-sol.")),
            Given(dispatch(description="profile the build"))
                >> Answered(Refused(f"Journal law L5 requires a name on every subagent dispatch: start the description with the name, a colon, then the task. {NAMING}")),
            Given(dispatch()) >> Answered(Allowed()),
            Given(dispatch(kind="", task="search_history", model="gpt-5.6-luna", models=("gpt-5.6-luna", "gpt-6-sol"), description="Dr. Einstein: search the history")) >> Answered(Allowed()),
            Given(dispatch(kind="general-purpose", subagent=True)) >> Answered(Allowed()),
        ])
        journal.events.answer(ToolCallAsked, RefuseWholeLongReads(), expects=[
            Given(reading("Read", file_path="long.py"), files=answering(LONG)) >> Answered(Refused(READ_REFUSED)),
            Given(reading("Read", file_path="long.py", offset=1, limit=50), files=answering(LONG)) >> Answered(Allowed()),
            Given(reading("Read", file_path="short.py"), files=answering({"short.py": "x = 1\n" * 20})) >> Answered(Allowed()),
            Given(reading("Read", file_path="shot.png"), files=answering({"shot.png": "\x89PNG\0" + "\n" * 900})) >> Answered(Allowed()),
            Given(reading("Bash", command="cat long.py"), files=answering(LONG)) >> Answered(Refused(CAT_REFUSED)),
            Given(reading("Bash", command="cat long.py | head -20"), files=answering(LONG)) >> Answered(Allowed()),
            Given(reading("Bash", command="sed -n '1,50p' long.py"), files=answering(LONG)) >> Answered(Allowed()),
            Given(ToolCallAsked(tool="Read", input=json.dumps({"file_path": "long.py"}), subagent=True), files=answering(LONG)) >> Answered(Allowed()),
            Given(reading("Read", file_path="long.py"), files=answering(LONG), settings={"journal_laws.whole_read_lines": 100_000}) >> Answered(Allowed()),
        ])
        journal.events.listen(ToolCallAnswered, SpotLongReadRefused(), expects=[
            Given(called("Read", json.dumps({"file_path": "long.py"}), why=READ_REFUSED), files=answering(LONG))
                >> Dispatches(LongReadRefused(agent=1, path="long.py", count=800, instead=RANGE)),
            Given(called("Bash", "cat long.py", why=CAT_REFUSED), files=answering(LONG))
                >> Dispatches(LongReadRefused(agent=1, path="long.py", count=800, instead="print a range: sed -n '1,120p' long.py")),
            Given(called("Read", json.dumps({"file_path": "long.py"})), files=answering(LONG)) >> Dispatches(nothing),
            Given(called("Read", json.dumps({"file_path": "long.py"}), why="plan 4 is open"), files=answering(LONG)) >> Dispatches(nothing),
            Given(called("Read", json.dumps({"file_path": "long.py"}), why=READ_REFUSED, subagent=True), files=answering(LONG)) >> Dispatches(nothing),
        ])
        journal.events.handle(LongReadRefused, MarkTheRefusedRead(), expects=[
            Given(LongReadRefused(agent=1, path="/work/long.py", count=800, instead=RANGE), rows=[AgentRow(n=1)])
                >> Updated(AgentRow(n=1), cards=[{"label": "Refused reading a long file whole `/work/long.py`", "icon": "terminal", "tone": "danger",
                                                  "title": f"800 lines; told to {RANGE} or grep instead"}]),
        ])
        journal.events.listen(ToolCallAnswered, SpotLawInCall(), expects=[
            Given(called("Bash", "cat notes.txt")) >> Dispatches(mention("L3")),
            Given(called("Bash", "ls")) >> Dispatches(nothing),
            Given(called("Bash", "cat notes.txt", why="plan 4 is open")) >> Dispatches(nothing),
            Given(called("Bash", "cat notes.txt", subagent=True)) >> Dispatches(nothing),
            Given(called("Bash", "cat notes.txt"), settings=OFF) >> Dispatches(nothing),
            Given(called("Edit", json.dumps({"file_path": "a.py", "new_string": "def spotted(): pass"}))) >> Dispatches(mention("L7")),
            Given(called("Edit", json.dumps({"file_path": "a.py", "new_string": "cat is only a word here"}))) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentMessageSent, SpotLawInChat(), expects=[
            Given(AgentMessageSent(agent=1, text="I will dispatch a subagent for the research.")) >> Dispatches(mention("L1")) & Dispatches(mention("L2")) & Dispatches(mention("L4")) & Dispatches(mention("L5")),
            Given(AgentMessageSent(agent=1, text="The header is fixed.")) >> Dispatches(nothing),
            Given(AgentMessageSent(agent=1, text="I will print it with cat.")) >> Dispatches(nothing),
            Given(AgentMessageSent(agent=1, text="I will dispatch a subagent for the research."), settings=OFF) >> Dispatches(nothing),
        ])
        journal.events.handle(LawMentioned, RepeatTheLaw(), expects=[
            Given(LawMentioned(agent=1, law="L3", text=LAWS["L3"].text), rows=[AgentRow(n=1)]) >> Nudged(WHISPERED_LAW),
        ])
        journal.events.listen(ToolFinished, SpotLargerResult(), expects=[
            Given(ToolFinished(agent=1, tool="Bash", size=900_000)) >> Dispatches(LargerResult(agent=1, tool="Bash", size=900_000)),
            Given(ToolFinished(agent=1, tool="Bash", size=10)) >> Dispatches(nothing),
            Given(ToolFinished(agent=1, tool="Bash", size=25_000), remembered={"journal_laws.largest|1": 30_000}) >> Dispatches(nothing),
            Given(ToolFinished(agent=1, tool="Bash", size=40_000), remembered={"journal_laws.largest|1": 30_000}) >> Dispatches(LargerResult(agent=1, tool="Bash", size=40_000)),
            Given(ToolFinished(agent=1, tool="Bash", size=900_000), settings={".journal_laws.largest result": False}) >> Dispatches(nothing),
        ])
        journal.events.handle(LargerResult, NameTheLargestResult(), expects=[
            Given(LargerResult(agent=1, tool="Bash", size=900_000), rows=[AgentRow(n=1)]) >> Nudged(LARGEST_RESULT, tool="Bash", size="900,000") & Remembered("largest|1", 900_000),
        ])


def output_lines(record) -> int:
    return int(LawDetails.values(record).output_lines)
