from agents.terminal import OUTPUT_LINES
from features.base import Feature
from features.journal import Journal
from features.journal_laws.controller import Outputs
from features.journal_laws.details import LawDetails
from features.journal_laws.handlers import TOO_LONG, CheckChangedInstructions, NoticeLargestResult, long_briefings
from features.journal_laws.interceptors import EnforceDispatchLaw, RefuseWholeLongReads, WhisperLawInChat, WhisperLawOnKeyword
from features.journal_laws.policy import carry
from features.nudges import Nudge
from features.session_briefing.start import LAW, START_PARTS

__all__ = ["Outputs"]


class Law(Feature):
    details = LawDetails
    nudges = (Nudge(TOO_LONG, behaviour=TOO_LONG, about=long_briefings),)

    def register(self, journal: Journal) -> None:
        START_PARTS[LAW] = carry
        if output_lines not in OUTPUT_LINES:
            OUTPUT_LINES.append(output_lines)
        journal.agent.canceler(EnforceDispatchLaw())
        journal.agent.interceptor(WhisperLawOnKeyword())
        journal.agent.interceptor(RefuseWholeLongReads())
        journal.events.handler(WhisperLawInChat())
        journal.events.handler(NoticeLargestResult())
        journal.events.handler(CheckChangedInstructions())


def output_lines(record) -> int:
    return int(LawDetails.values(record).output_lines)
