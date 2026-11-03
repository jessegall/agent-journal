import sqlite3

from core.base.database.database import Database
from core.base.database.module_migrations import ModuleMigrations
from core.base.database.schema import Schema
from core.base.database.statement import Statement
from core.base.query.queries import Queries
from core.modules.memories.memories_module import MemoriesModule
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


def repair_zero_weights(story) -> None:
    zero = story.new_row_id('memory make "A hidden fact" --type fact --weight 0 --environment main')
    project = story.new_row_id('memory make "A hidden project fact" --type fact --weight 0 --project')
    rule = story.new_row_id('memory make "A permanent rule" --type rule --weight 0 --environment main')
    reminder = story.new_row_id('memory make "A permanent reminder" --type reminder --weight 0 --environment main')
    positive = story.new_row_id('memory make "A fact to keep" --type fact --weight 1 --environment main')
    removed = story.new_row_id('memory make "Already removed" --type fact --weight 0 --environment main')
    story.expect_success(f'memory remove {removed} --reason "no longer true"')
    prior = story.container.get(Queries).query(Memory).find(removed)
    database = story.container.get(Database)
    database.update(Statement("DELETE FROM migrations WHERE module = ? AND number > 2", [MemoriesModule.name]))
    migrations = [ModuleMigrations(MemoriesModule.name, [migration() for migration in MemoriesModule.migrations])]
    schema = story.container.get(Schema)
    assert schema.migrate(migrations) == [f"{MemoriesModule.name} 3"]
    expect_removed(story, zero)
    expect_removed(story, project)
    expect_unchanged(story, [rule, reminder], 0)
    expect_unchanged(story, [positive], 1)
    assert story.container.get(Queries).query(Memory).find(removed) == prior
    after = story.container.get(Queries).query(Memory).find(zero)
    assert schema.migrate(migrations) == []
    assert story.container.get(Queries).query(Memory).find(zero) == after


def prepare_zero_weight_fact(folder) -> None:
    with sqlite3.connect(folder / "journal.db") as database:
        database.execute("UPDATE memories SET weight = 0 WHERE id = 1")
