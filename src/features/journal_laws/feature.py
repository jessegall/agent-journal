from agents.terminal import OUTPUT_LINES
from features.base import Feature
from features.journal import Journal
from features.journal_laws.controller import Outputs
from features.journal_laws.details import LawDetails
from features.journal_laws.handlers import NoticeLargestResult
from features.journal_laws.interceptors import EnforceDispatchLaw, RefuseWholeLongReads, WhisperLawInChat, WhisperLawOnKeyword

__all__ = ["Outputs"]


class Law(Feature):
    details = LawDetails

    def register(self, journal: Journal) -> None:
        if output_lines not in OUTPUT_LINES:
            OUTPUT_LINES.append(output_lines)
        journal.agent.canceler(EnforceDispatchLaw())
        journal.agent.interceptor(WhisperLawOnKeyword())
        journal.agent.interceptor(RefuseWholeLongReads())
        journal.events.handler(WhisperLawInChat())
        journal.events.handler(NoticeLargestResult())


def output_lines(record) -> int:
    return int(LawDetails.values(record).output_lines)
