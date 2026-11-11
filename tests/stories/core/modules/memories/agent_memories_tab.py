import json

from tests.stories.core.modules.memories.support.memory_owners import MainAndWorkerMemories, read_agent, started_agent
from tests.stories.support.story_checks import expect_value

ACTIVE_READ = "memory page --agent {agent} --state active --order weight --limit 100 --json"
REMOVED_READ = "memory page --agent {agent} --removed --state removed --order weight --limit 100 --json"


def page_rows(story, line, agent):
    return json.loads(story.run(line.format(agent=agent.id), actor=story.user).output_text)["rows"]


def test_the_memories_tab_lists_the_memories_of_one_agent_heaviest_first_and_the_removed_ones_apart(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker = read_agent(story, "s-9")
    story.expect_success('memory make "Run the tests of the change only" --weight 9 --environment main', actor=worker)
    story.expect_success('memory make "Rebuild the dist after a Vue change" --weight 3 --environment main', actor=worker)
    removed = story.new_row_id('memory make "The old branch name" --weight 6 --environment main', actor=worker)
    story.expect_success(f'memory remove {removed} --reason "The branch was renamed"', actor=worker)
    kept = page_rows(story, ACTIVE_READ, worker)
    expect_value([(row["text"], row["weight"], row["state"]) for row in kept], [("Run the tests of the change only", 9, "active"), ("My worktree is clean", 5, "active"), ("Rebuild the dist after a Vue change", 3, "active")])
    expect_value({row["agent_id"] for row in kept}, {worker.id})
    folded = page_rows(story, REMOVED_READ, worker)
    expect_value([(row["text"], row["state"], row["reason"]) for row in folded], [("The old branch name", "removed", "The branch was renamed")])


def test_the_memories_tab_of_an_agent_without_memories_lists_none(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    helper = started_agent(story, "s-30", "helper")
    expect_value(page_rows(story, ACTIVE_READ, helper), [])
    expect_value(page_rows(story, REMOVED_READ, helper), [])
