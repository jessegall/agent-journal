import json

from engine.actor.actor import Actor
from engine.database.database import Database
from engine.registry.registry import Registry
from tests.stories.core.modules.memories.support.memory_owners import MAIN_FACT, MAIN_MEMORY, MainAndWorkerMemories, WORKER_FACT, WORKER_MEMORY, read_agent, started_agent
from tests.stories.core.modules.viewer.support.window_story import WindowStory

WINDOW = "memories.memories"


def holders(story, flags="", line="memory agents"):
    outcome = story.run(f"{line} --json {flags}".strip(), story.user)
    assert outcome.code == 0, f"{line} {flags} gave {outcome.code}: {outcome.output_text}"
    return json.loads(outcome.output_text)


def names(story, flags=""):
    return [row["name"] for row in holders(story, flags)["rows"]]


def memory_texts(story, flags):
    return [row["text"] for row in holders(story, flags, "memory list")["rows"]]


def worker_memory(story, session, text, actor):
    story.expect_success(f'memory make "{text}" --environment main', actor=actor)


def test_the_page_reads_the_memories_it_lists_and_follows_memory_events(played):
    story = played(MainAndWorkerMemories)
    window = WindowStory(story)
    window.expect_window_allowed(WINDOW, "memory page --json --state active --order weight --limit 50")
    window.expect_window_allowed(WINDOW, "memory list --json --main-agent --order weight --search queue --state removed")
    registered = Registry.read(story.container.get(Database)).window(WINDOW)
    story.expect_rows("memory.*" in registered.events and "memory page" in registered.reads)






































