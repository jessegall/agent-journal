from journal.http.transcripts.transcript_entry import TranscriptEntry
from journal.http.transcripts.transcript_heading import TranscriptHeading
from journal.http.transcripts.transcript_slice import TranscriptSlice
from journal.providers.support.turn import Turn
from journal.support.missing_row import MissingRow

SPEAKER_ROLES = ("human", "agent")
LARGEST_TURNS = 1000
PAGE_TURNS = 300


class TranscriptPage:
    """A transcript's turns as the viewer's log reads them: what a person said and the agent answered in full, every other entry as its heading, its text asked for when it is opened."""

    def __init__(self, turns: list[Turn]) -> None:
        self.turns = turns

    def page(self, start: int = 0, previous: int = 0, size: int = PAGE_TURNS) -> TranscriptSlice:
        stored = [t for t in self.turns if t.line > start and (not previous or t.line < previous)]
        shown = stored[-max(1, min(size, LARGEST_TURNS)):]
        return TranscriptSlice(total=len(self.turns), first=self.turns[0].line if self.turns else 0, turns=[self.heading(t) for t in shown])

    @staticmethod
    def heading(turn: Turn) -> TranscriptHeading:
        return TranscriptHeading(line=turn.line, speaker=turn.speaker, kind=turn.kind, time=turn.time, tools=turn.tools, text=turn.text if turn.kind in SPEAKER_ROLES else "", has_text=bool(turn.text))

    def entry(self, line: int) -> TranscriptEntry:
        turn = next((t for t in self.turns if t.line == line), None)
        if turn is None:
            raise MissingRow("transcript entries", line)
        return TranscriptEntry(line=turn.line, text=turn.text, formatted="")
