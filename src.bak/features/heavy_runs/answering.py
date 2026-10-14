from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from features.heavy_runs.holding import ahead_of, queue_of
from receiving import Answerer
from serving import ReadElsewhere, ReadJournalRoot, Settings


class HoldHeavyRunsToOneAtATime(Answerer[ToolCallAsked]):
    """A heavy run asked for while another is going is turned back and told where it stands, so the wait is the journal's to remember and not the agent's."""

    def answer(self, event: ToolCallAsked, elsewhere: ReadElsewhere, journal_root: ReadJournalRoot, settings: Settings) -> Answer:
        record = elsewhere.here().record
        ahead = ahead_of(record, event.command)
        if not ahead:
            return Allowed()
        where, command = ahead[0]
        queued = [run for run in queue_of(journal_root, settings.forgotten_after).waiting() if run.environment != record.env]
        return Refused(f"{command} is running in {where}, and two heavy runs at once make both slower and neither time trustworthy. "
                       f"You are number {len(queued) + 1} of {len(queued) + 1} in the project's queue: start this again when that one has ended.")
