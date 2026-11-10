import json
from collections.abc import Sequence

from engine.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.models.enums.memory_state import MemoryState
from core.modules.memories.models.memory import Memory
from core.testing.story import Story
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import ServerStory

BROWSER_CAPTURE = "/tmp/journal-worker-450-memory-round.png"


def faded_marks(story: Story) -> list[ChatMark]:
    return list(story.container.get(Queries).query(ChatMark).filter(type=MemoryMarkType.MEMORY.value, variant=MemoryMarkVariant.FADED.value).all_rows())


def expect_round(story: Story, shown: Sequence[tuple[int, int, int]], faded: Sequence[tuple[int, int, int]], excluded: Sequence[int]) -> ChatMark:
    marks = faded_marks(story)
    assert len(marks) == 1, [(mark.text, mark.lines) for mark in marks]
    mark = marks[0]
    assert mark.text == f"Memories faded by one: {len(shown)} of {len(shown) + len(faded)} still shown", mark.text
    expected = {f"{part}|{memory_id}|{prior}|{weight}" for part, rows in (("shown", shown), ("faded", faded)) for memory_id, prior, weight in rows}
    assert set(mark.lines.splitlines()) == expected, mark.lines
    for memory_id in excluded:
        memory = story.container.get(Queries).query(Memory).find(memory_id)
        assert memory.state is MemoryState.ACTIVE and memory.removed_at is None, memory
    return mark


def expect_faded_mark_count(story: Story, count: int) -> None:
    assert len(faded_marks(story)) == count, [(mark.text, mark.lines) for mark in faded_marks(story)]


def expect_browser_round(server: ServerStory, mark_id: int, shown: Sequence[int], faded: Sequence[int], excluded: Sequence[int]) -> None:
    expect_browser(server, "memoryRound.browser.mjs", [json.dumps({"mark": mark_id, "shown": list(shown), "faded": list(faded), "excluded": list(excluded)}), BROWSER_CAPTURE])
