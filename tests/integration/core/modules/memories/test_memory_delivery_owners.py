import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.memories.migrations.m006_memory_owner import MemoryOwnerMigration
from core.modules.memories.models.memory import Memory
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.memories.support.memory_owners import MAIN_FACT, MAIN_MEMORY, MainAndWorkerMemories, WORKER_FACT, WORKER_MEMORY, read_agent, stored_memory
from core.modules.memories.nudges.start_memories_message import StartMemoriesMessage
from engine.testing.expectations.expected_message import expected_nudge

TEST_ROWS_REASON = "the test reads every row it checks"

COMPACTION = HookSamples.sample("compact")
SESSION_START = HookSamples.session_start()
CART_EDIT = HookSamples.edit("src/cart.py")






def test_a_scope_shows_only_its_agent_s_rows_and_ends_with_its_block(played):
    story = played(MainAndWorkerMemories)
    queries, scopes = story.container.get(Queries), story.container.get(Scopes)
    with scopes.opened(read_agent(story, "s-9").id):
        story.expect_rows([memory.id for memory in queries.query(Memory).every_row(TEST_ROWS_REASON)] == [WORKER_MEMORY])
    story.expect_rows(queries.query(Memory).count() == 2)


def test_a_nested_scope_gives_the_outer_scope_back(played):
    story = played(MainAndWorkerMemories)
    queries, scopes = story.container.get(Queries), story.container.get(Scopes)
    with scopes.opened(story.agent.id):
        with scopes.opened(None):
            story.expect_rows(queries.query(Memory).count() == 2)
        story.expect_rows([memory.id for memory in queries.query(Memory).every_row(TEST_ROWS_REASON)] == [MAIN_MEMORY])




















def test_the_migration_gives_old_rows_their_owner(played):
    story = played(MainAndWorkerMemories)
    database = story.container.get(Database)
    database.update(Statement("UPDATE memories SET agent_id = ? WHERE id = ?", [story.agent.id, MAIN_MEMORY]))
    database.update(Statement("UPDATE memories SET agent_id = NULL WHERE id = ?", [WORKER_MEMORY]))
    for statement in MemoryOwnerMigration.statements[:2]:
        database.update(Statement(statement))
    story.expect_rows(stored_memory(story, MAIN_MEMORY).agent_id is None, stored_memory(story, WORKER_MEMORY).agent_id == read_agent(story, "s-9").id)
