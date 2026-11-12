from types import SimpleNamespace

from engine.enums.agent_role import AgentRole
from engine.provider.transcript_author import USER_AUTHOR
from engine.provider.transcript_row import TranscriptRow
from core.modules.agents.support.transcript_authors import TranscriptAuthors


class CountedAuthors(TranscriptAuthors):
    """Counts how often the sender of a user row is asked."""

    def __init__(self) -> None:
        self.asked: list[str] = []

    def sender(self, agent, row: TranscriptRow) -> str:
        self.asked.append(row.text)
        return "journal"


def test_a_text_repeated_in_the_transcript_asks_its_sender_once():
    authors = CountedAuthors()
    rows = [TranscriptRow(number, USER_AUTHOR, USER_AUTHOR, text) for number, text in enumerate(["Stop hook feedback", "Stop hook feedback", "Go on", "Stop hook feedback"])]
    tagged = authors.tagged(SimpleNamespace(role=AgentRole.HELPER), rows)
    assert (authors.asked, [row.author for row in tagged]) == (["Stop hook feedback", "Go on"], ["journal"] * 4)
