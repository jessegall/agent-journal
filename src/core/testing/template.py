from dataclasses import dataclass
from engine.journal.journal_home import JournalHome
from core.testing.story_state import StoryState


@dataclass(frozen=True)
class Template:
    """A built database a story is copied from, with what the story knows beside it."""

    home: JournalHome
    state: StoryState
