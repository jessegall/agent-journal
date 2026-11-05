from tests.stories.core.modules.memories.support.memory_owners import MAIN_FACT, MAIN_MEMORY, MainAndWorkerMemories, WORKER_FACT, WORKER_MEMORY, agent_of, expect_hidden, started_agent, stored_memory
from tests.stories.core.support.fixtures import UserJoined


def test_an_agent_cannot_write_a_memory_in_another_environment(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("environment make staging /work/staging")
    story.expect_refusal('memory make "Staging has no queue" --environment staging', "only in its own environment", actor=story.agent)


def test_a_worker_s_memory_holds_the_worker_s_id(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success(f"memory show {WORKER_MEMORY}", f"agent_id: {agent_of(story, 's-9').id}")


def test_a_main_agent_s_memory_stores_no_session_id(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_rows(stored_memory(story, MAIN_MEMORY).agent_id is None)


def test_the_main_agent_never_sees_a_worker_s_memory(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    expect_hidden(story, WORKER_MEMORY, WORKER_FACT, story.agent)


def test_a_worker_never_sees_the_main_agent_s_memory(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    expect_hidden(story, MAIN_MEMORY, MAIN_FACT, agent_of(story, "s-9"))


def test_a_worker_never_sees_another_worker_s_memory(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    expect_hidden(story, WORKER_MEMORY, WORKER_FACT, started_agent(story, "s-10"))


def test_a_new_worker_does_not_inherit_an_ended_worker_s_memory(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success(f"agent end {agent_of(story, 's-9').id}", actor=story.user)
    expect_hidden(story, WORKER_MEMORY, WORKER_FACT, started_agent(story, "s-10"))


def test_a_person_sees_the_memories_of_every_agent(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_text("memory list --environment main", WORKER_FACT, MAIN_FACT, actor=story.user)


def test_a_memory_a_person_makes_goes_to_the_main_agent_alone(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    memory_id = story.new_row_id('memory make "The release waits for me" --environment main', actor=story.user)
    story.expect_text("memory list", "The release waits for me", actor=story.agent)
    expect_hidden(story, memory_id, "The release waits for me", agent_of(story, "s-9"))
