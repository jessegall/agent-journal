import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.modules.memories.migrations.m006_memory_owner import MemoryOwnerMigration
from core.modules.memories.models.memory import Memory
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.memories.support.memory_owners import MAIN_FACT, MAIN_MEMORY, MainAndWorkerMemories, WORKER_FACT, WORKER_MEMORY, agent_of, stored_memory

COMPACTION = HookSamples.sample("compact")
SESSION_START = HookSamples.session_start()
CART_EDIT = HookSamples.edit("src/cart.py")


@pytest.mark.parametrize("owner_session", ["s-1", "s-9"])
def test_an_edited_memory_is_not_kept_for_another_agent_to_edit(new_story, owner_session):
    story = new_story(fixture=MainAndWorkerMemories)
    owner = story.agent if owner_session == "s-1" else agent_of(story, "s-9")
    forbidden_agent = agent_of(story, "s-9") if owner_session == "s-1" else story.agent
    memory_id = MAIN_MEMORY if owner_session == "s-1" else WORKER_MEMORY
    story.expect_success(f'memory edit {memory_id} --text "Only its owner changed it"', actor=owner)
    story.expect_refusal(f'memory edit {memory_id} --text "Another agent changed it"', "no memory", actor=forbidden_agent)
    story.expect_text(f"memory show {memory_id}", "Only its owner changed it", actor=owner)


def test_a_job_with_no_scope_reads_the_memories_of_every_agent(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_rows(story.container.get(Queries).query(Memory).count() == 2)


def test_a_scope_shows_only_its_agent_s_rows_and_ends_with_its_block(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    queries, scopes = story.container.get(Queries), story.container.get(Scopes)
    with scopes.opened(agent_of(story, "s-9").id):
        story.expect_rows([memory.id for memory in queries.query(Memory).all_rows()] == [WORKER_MEMORY])
    story.expect_rows(queries.query(Memory).count() == 2)


def test_a_nested_scope_gives_the_outer_scope_back(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    queries, scopes = story.container.get(Queries), story.container.get(Scopes)
    with scopes.opened(story.agent.id):
        with scopes.opened(None):
            story.expect_rows(queries.query(Memory).count() == 2)
        story.expect_rows([memory.id for memory in queries.query(Memory).all_rows()] == [MAIN_MEMORY])


def test_a_listener_that_declares_no_scope_ends_a_worker_s_memory_with_its_task(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    task_id = story.new_row_id('task make "Cart" --brief "Fix the cart" --environment main', actor=story.user)
    memory_id = story.new_row_id(f'memory make "The cart needs euros" --task {task_id} --environment main', actor=agent_of(story, "s-9"))
    story.run(f'task cancel {task_id} --reason "not needed"', actor=story.agent)
    story.run_listeners()
    story.expect_success(f"memory show {memory_id}", "state: removed")


def test_weighing_a_worker_s_memory_with_its_own_changes_neither(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_refusal(f"memory weigh {MAIN_MEMORY},{WORKER_MEMORY} 8", "no memory", actor=story.agent)
    story.expect_rows(stored_memory(story, MAIN_MEMORY).weight == 5)


def test_a_refused_read_counts_no_memory_in_the_reader_s_context(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.run(f"memory read {WORKER_MEMORY}", actor=story.agent)
    story.expect_no_text("memory context", WORKER_FACT, actor=story.agent)


def test_a_session_start_counts_only_the_agent_s_memories(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_hook_allowed("s-1", SESSION_START, f"1 memories to read: load the memory skill as directed, then list them")


def test_a_keyword_of_a_worker_s_memory_gives_the_main_agent_nothing(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.run('memory make "The cart is in cents" --keywords cart --environment main', actor=agent_of(story, "s-9"))
    story.expect_absent_hook_line("s-1", CART_EDIT, "applies now")


def test_a_keyword_of_the_main_agent_s_memory_gives_a_worker_nothing(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.run('memory make "The cart is in cents" --keywords cart --environment main', actor=story.agent)
    story.expect_absent_hook_line("s-9", CART_EDIT, "applies now")


def test_a_worker_s_compaction_leaves_the_main_agent_s_memories(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.hook("s-9", COMPACTION)
    story.run_listeners()
    story.expect_rows(stored_memory(story, MAIN_MEMORY).weight == 5, stored_memory(story, WORKER_MEMORY).weight == 4)


def test_a_main_agent_s_compaction_leaves_a_worker_s_memories(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.hook("s-1", COMPACTION)
    story.run_listeners()
    story.expect_rows(stored_memory(story, MAIN_MEMORY).weight == 4, stored_memory(story, WORKER_MEMORY).weight == 5)


def test_a_worker_s_faded_memory_is_not_listed_for_the_main_agent(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.run('memory make "Soon gone" --weight 1 --environment main', actor=agent_of(story, "s-9"))
    story.hook("s-9", COMPACTION)
    story.run_listeners()
    story.expect_no_text("memory faded", "Soon gone", actor=story.agent)


def test_an_agent_cannot_remove_or_restore_another_agent_s_memory(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_refusal(f'memory remove {WORKER_MEMORY} --reason "not mine"', "no memory", actor=story.agent)
    story.expect_refusal(f"memory restore {MAIN_MEMORY}", "no memory", actor=agent_of(story, "s-9"))


def test_the_migration_gives_old_rows_their_owner(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    database = story.container.get(Database)
    database.update(Statement("UPDATE memories SET agent_id = ? WHERE id = ?", [story.agent.id, MAIN_MEMORY]))
    database.update(Statement("UPDATE memories SET agent_id = NULL WHERE id = ?", [WORKER_MEMORY]))
    for statement in MemoryOwnerMigration.statements[:2]:
        database.update(Statement(statement))
    story.expect_rows(stored_memory(story, MAIN_MEMORY).agent_id is None, stored_memory(story, WORKER_MEMORY).agent_id == agent_of(story, "s-9").id)
