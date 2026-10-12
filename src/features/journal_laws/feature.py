from pathlib import Path

from agents.terminal import OUTPUT_LINES
from events.agents import SessionStarted, ToolFinished
from events.agents import AgentMessageSent
from expects import Given, Kept, Nudged, Refused, Remembered, Unchanged
from features.base import Feature
from features.journal import Journal
from features.journal_laws.controller import Outputs
from features.journal_laws.briefing import brief, long_briefings
from features.journal_laws.details import LARGEST_RESULT, TOO_LONG, LawDetails
from features.journal_laws.handlers import CheckChangedInstructions, NoticeLargestResult
from features.journal_laws.interceptors import EnforceDispatchLaw, RefuseWholeLongReads, WhisperLawInChat, WhisperLawOnKeyword, lines_in
from features.journal_laws.laws import carry, naming_of
from providers.payload import BashCall, Dispatch, ReadCall
from resources.types import AgentRow
from features.sending import Nudge
from features.work_modes.modes import CARRIED_IN
from features.session_briefing.start import LAW, START_PARTS

__all__ = ["Outputs"]

LAWS_FILE = Path(__file__).with_name("laws.py")


class JournalLaws(Feature):
    details = LawDetails
    nudges = (Nudge(TOO_LONG, behaviour=TOO_LONG, about=long_briefings,
                    guarantee="When a briefing file has grown longer than the agent's provider will read, the agent is told which file and by how much."),)

    def register(self, journal: Journal) -> None:
        START_PARTS.add(self, carry, key=LAW)
        if brief not in CARRIED_IN.each():
            CARRIED_IN.add(self, brief)
        if output_lines not in OUTPUT_LINES:
            OUTPUT_LINES.append(output_lines)
        journal.agent.canceler(EnforceDispatchLaw(), expects=[
            Given(Dispatch(kind="general-purpose", model="sonnet", model_supported=True), rows=[AgentRow(n=1)])
                >> Refused("Journal law L2 refuses generic subagents. Choose a specific agent type or give the dispatch a concrete task name and bounded assignment."),
            # no model is the case: a missing model is what law L1 refuses
            Given(Dispatch(kind="Plan", model=None, model_supported=True, description="Dr. Einstein: profile the build"), rows=[AgentRow(n=1)])
                >> Refused("Journal law L1 requires an explicit model on every subagent dispatch. Choose the least expensive model that reliably fits the work."),
            Given(Dispatch(kind="Plan", model="gpt-9", model_supported=True, models=("sonnet", "haiku"), description="Dr. Einstein: profile the build"), rows=[AgentRow(n=1)])
                >> Refused("gpt-9 is not a model this account offers. Choose one of sonnet, haiku."),
            Given(Dispatch(kind="Plan", model="sonnet", model_supported=True, models=("sonnet", "haiku"), name_supported=True, description="profile the build"), rows=[AgentRow(n=1)])
                >> Refused(f"Journal law L5 requires a name on every subagent dispatch: start the description with the name, a colon, then the task. {naming_of()}"),
            Given(Dispatch(kind="Plan", model="sonnet", model_supported=True, models=("sonnet", "haiku"), name_supported=True, description="Dr. Einstein: profile the build"), rows=[AgentRow(n=1)])
                >> Kept(),
        ])
        journal.agent.interceptor(WhisperLawOnKeyword(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "cat notes.txt"}, {}), rows=[AgentRow(n=1)]) >> Kept() & Nudged("whisper"),
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[AgentRow(n=1)]) >> Kept() & Unchanged(),
        ])
        journal.agent.interceptor(RefuseWholeLongReads(), expects=[
            Given(ReadCall.from_payload("Read", {"file_path": str(LAWS_FILE)}, {}), rows=[AgentRow(n=1)], settings={"journal_laws.whole_read_lines": 1})
                >> Refused(f"{LAWS_FILE} has {lines_in(LAWS_FILE):,} lines, too long to read whole (law L3, read narrowly). Instead: read a range (offset 1, limit 120), then the next range; "
                           f"or list its headings first with grep -n '^#' {LAWS_FILE} and read only the part you need; or grep -n for the line you want."),
            Given(ReadCall.from_payload("Read", {"file_path": str(LAWS_FILE), "limit": 120}, {}), rows=[AgentRow(n=1)], settings={"journal_laws.whole_read_lines": 1}) >> Kept(),
            Given(ReadCall.from_payload("Read", {"file_path": str(LAWS_FILE)}, {}), rows=[AgentRow(n=1)], settings={"journal_laws.whole_read_lines": 100_000}) >> Kept(),
            Given(BashCall.from_payload("Bash", {"command": f"cat {LAWS_FILE}"}, {}), rows=[AgentRow(n=1)], settings={"journal_laws.whole_read_lines": 1})
                >> Refused(f"{LAWS_FILE} has {lines_in(LAWS_FILE):,} lines, too long to read whole (law L3, read narrowly). Instead: print a range: sed -n '1,120p' {LAWS_FILE}, then the next range; "
                           f"or list its headings first with grep -n '^#' {LAWS_FILE} and read only the part you need; or grep -n for the line you want."),
        ])
        journal.events.handler(WhisperLawInChat(), expects=[
            Given(AgentMessageSent(agent=1, text="I will dispatch a subagent for the research."), rows=[AgentRow(n=1)]) >> Nudged("whisper"),
            Given(AgentMessageSent(agent=1, text="The header is fixed."), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])
        journal.events.handler(NoticeLargestResult(), expects=[
            Given(ToolFinished(agent=1, tool="Bash", size=900_000), rows=[AgentRow(n=1)]) >> Nudged(LARGEST_RESULT, tool="Bash", size="900,000") & Remembered("largest", 900_000),
            Given(ToolFinished(agent=1, tool="Bash", size=10), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])
        journal.events.handler(CheckChangedInstructions(), expects=[
            Given(SessionStarted(agent=1, compacted=True), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])


def output_lines(record) -> int:
    return int(LawDetails.values(record).output_lines)
