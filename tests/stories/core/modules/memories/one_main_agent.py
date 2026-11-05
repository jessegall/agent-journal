from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.memories.support.memory_owners import MAIN_FACT, MAIN_MEMORY, MainAndWorkerMemories, WORKER_FACT, agent_of, started_agent, stored_memory

COMPACTION = HookSamples.sample("compact")


def test_a_new_main_session_sees_the_memories_of_the_session_before_it(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_text("memory list", MAIN_FACT, actor=started_agent(story, "s-2", "main"))


def test_a_new_main_session_does_not_see_a_worker_s_memory(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    second = started_agent(story, "s-2", "main")
    story.run("agent show 1", actor=second)
    story.expect_no_text("memory list", WORKER_FACT, actor=second)


def test_a_main_session_that_ended_leaves_its_memories_to_the_next(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.expect_text("memory list", MAIN_FACT, actor=started_agent(story, "s-2", "main"))


def test_two_main_sessions_at_once_share_what_each_makes(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    second = started_agent(story, "s-2", "main")
    story.run('memory make "Made in the second session" --environment main', actor=second)
    story.expect_text("memory list", "Made in the second session", actor=story.agent)


def test_a_new_main_session_can_weigh_a_memory_of_the_session_before_it(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success(f"memory weigh {MAIN_MEMORY} 8", actor=started_agent(story, "s-2", "main"))


def test_a_compaction_of_a_new_main_session_fades_the_memories_of_the_session_before_it(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    started_agent(story, "s-2", "main")
    story.hook("s-2", COMPACTION)
    story.run_listeners()
    story.expect_rows(stored_memory(story, MAIN_MEMORY).weight == 4)


def test_a_worker_gets_no_memory_from_a_main_session_it_outlives(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.expect_no_text("memory list", MAIN_FACT, actor=agent_of(story, "s-9"))
