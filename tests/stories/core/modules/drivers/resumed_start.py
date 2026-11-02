from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

RESUME = HookSamples.session_start().with_fields(raw={"source": "resume"})
COMPACTION = HookSamples.session_start().with_fields(raw={"source": "compact"})
MEMORY = "1 memories to read"


def kept_memory_story(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "Keep the totals in cents" --type fact --weight 5 --environment main', actor=story.agent)
    return story


def test_a_resumed_session_gets_no_start_lines(new_story):
    story = kept_memory_story(new_story)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    assert story.hook("s-1", RESUME).lines == []


def test_a_first_start_gets_the_memories(new_story):
    story = kept_memory_story(new_story)
    assert any(MEMORY in line for line in story.hook("s-2", HookSamples.session_start().with_fields(session="s-2")).lines)


def test_a_start_after_a_compaction_gets_the_memories(new_story):
    story = kept_memory_story(new_story)
    assert any(MEMORY in line for line in story.hook("s-1", COMPACTION).lines)


def test_a_resumed_session_makes_no_start_skill_due(new_story):
    story = new_story(fixture=BuilderStarted)
    listed_rows = story.run(f"agent-skill list --agent {story.agent.id}", actor=story.agent).output_text
    story.hook("s-1", RESUME)
    story.run_listeners()
    assert story.run(f"agent-skill list --agent {story.agent.id}", actor=story.agent).output_text == listed_rows
