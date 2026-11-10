import sqlite3

from engine.query.queries import Queries
from core.modules.memories.models.enums.memory_state import MemoryState
from core.modules.memories.models.memory import Memory


def expect_removed(story, memory_id: int) -> None:
    memory = story.container.get(Queries).query(Memory).find(memory_id)
    assert memory.weight == 0 and memory.state is MemoryState.REMOVED, memory
    assert memory.removed_at is not None and memory.reason == "faded to weight 0", memory
    active = story.container.get(Queries).query(Memory).filter(state=MemoryState.ACTIVE).all_rows()
    assert memory_id not in [row.id for row in active]


def expect_unchanged(story, memory_ids: list[int], weight: int) -> None:
    for memory_id in memory_ids:
        memory = story.container.get(Queries).query(Memory).find(memory_id)
        assert memory.state is MemoryState.ACTIVE and memory.weight == weight and memory.removed_at is None, memory


def prepare_zero_weight_fact(folder) -> None:
    with sqlite3.connect(folder / "journal.db") as database:
        database.execute("UPDATE memories SET weight = 0 WHERE id = 1")
