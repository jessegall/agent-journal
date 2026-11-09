import json

from core.base.actor import Actor
from core.base.database.database import Database
from core.base.registry.registry import Registry
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


def test_the_page_reads_the_agents_holding_memories_and_follows_agent_events(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    window = WindowStory(story)
    window.expect_window_allowed(WINDOW, "memory agents --json --page 2 --limit 30 --role worker --name lovelace --working")
    window.expect_window_allowed(WINDOW, "memory list --json --main-agent --order weight --search queue --state removed")
    registered = Registry.read(story.container.get(Database)).window(WINDOW)
    story.expect_rows("agent.*" in registered.events and "memory agents" in registered.reads)


def test_one_read_names_each_agent_that_holds_a_memory_with_its_counts(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker = read_agent(story, "s-9")
    started_agent(story, "s-10")
    with story.repeated_work.request():
        read = holders(story)
    story.expect_rows([(row["agent_id"], row["role"], row["name"], row["active_memories"], row["removed_memories"]) for row in read["rows"]] == [(worker.id, "worker", f"Worker {worker.id}", 1, 0)])
    story.expect_rows(read["total"] == 1)


def test_the_main_agent_is_not_one_of_the_listed_agents(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_rows("Main agent" not in " ".join(names(story)) and all(row["role"] != "main" for row in holders(story)["rows"]))


def test_a_removed_memory_counts_as_removed(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker_memory(story, "s-9", "My branch is merged", read_agent(story, "s-9"))
    story.expect_success(f"memory remove {WORKER_MEMORY} --reason stale", actor=story.user)
    row = holders(story)["rows"][0]
    story.expect_rows((row["active_memories"], row["removed_memories"]) == (1, 1))


def test_an_ended_agent_stays_listed_with_its_end_time_and_working_now_leaves_it_out(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker = read_agent(story, "s-9")
    story.expect_success(f"agent end {worker.id}", actor=story.user)
    story.expect_rows(holders(story)["rows"][0]["ended_at"])
    story.expect_rows(names(story, "--working") == [])


def test_ended_agents_come_newest_first(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    second = started_agent(story, "s-10")
    worker_memory(story, "s-10", "Second worker's memory", second)
    story.expect_success(f"agent end {second.id}", actor=story.user)
    story.expect_success(f"agent end {read_agent(story, 's-9').id}", actor=story.user)
    story.expect_rows(names(story) == [f"Worker {second.id}", f"Worker {read_agent(story, 's-9').id}"])


def test_the_agents_are_paged(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    for index in range(10, 14):
        worker_memory(story, f"s-{index}", f"Memory of {index}", started_agent(story, f"s-{index}"))
    first = holders(story, "--limit 2")
    last = holders(story, "--limit 2 --page 3")
    story.expect_rows((len(first["rows"]), first["total"], len(last["rows"])) == (2, 5, 1))


def test_a_helper_and_a_reviewer_are_found_by_their_role(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    helper, reviewer = started_agent(story, "s-10", "helper"), started_agent(story, "s-11", "reviewer")
    worker_memory(story, "s-10", "A helper's note", helper)
    worker_memory(story, "s-11", "A reviewer's note", reviewer)
    story.expect_rows([row["role"] for row in holders(story, "--role reviewer")["rows"]] == ["reviewer"])
    story.expect_rows(sorted(row["role"] for row in holders(story, "--access read-only")["rows"]) == ["helper", "reviewer"])
    story.expect_rows([row["role"] for row in holders(story, "--access writing")["rows"]] == ["worker"])


def test_agents_are_found_by_a_word_of_their_name_or_number(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker = read_agent(story, "s-9")
    helper = started_agent(story, "s-10", "helper")
    worker_memory(story, "s-10", "A helper's note", helper)
    story.expect_rows(names(story, f"--name worker") == [f"Worker {worker.id}"])
    story.expect_rows(names(story, f"--name {helper.id}") == [f"Read-only helper {helper.id}"])
    story.expect_rows(names(story, "--name nobody") == [])


def test_the_agents_of_a_page_of_memories_are_read_together_by_number(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    second_agent = started_agent(story, "s-10")
    worker_memory(story, "s-10", "Another note", second_agent)
    story.expect_rows(names(story, f"--agents {second_agent.id} {read_agent(story, 's-9').id}") == [f"Worker {second_agent.id}", f"Worker {read_agent(story, 's-9').id}"])
    story.expect_rows(names(story, f"--agents {second_agent.id}") == [f"Worker {second_agent.id}"])


def test_agents_are_listed_for_one_environment_or_for_all(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success("environment make staging /work/staging")
    staging = Actor(story.new_row_id("agent start s-20 claude worker --environment staging"), read_agent(story, "s-9").type)
    story.run('memory make "Staging has no queue" --environment staging', actor=staging)
    story.expect_rows(names(story, "--environment staging") == [f"Worker {staging.id}"])
    story.expect_rows(names(story, "--environment main") == [f"Worker {read_agent(story, 's-9').id}"])
    story.expect_rows(len(names(story)) == 2)


def test_a_person_lists_the_main_agent_s_memories_alone(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_rows(memory_texts(story, "--main-agent --environment main") == [MAIN_FACT])


def test_a_person_lists_the_memories_of_every_agent_but_the_main_one(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_rows(memory_texts(story, "--other-agents --environment main") == [WORKER_FACT])


def test_a_person_lists_one_agent_s_memories_alone(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_rows(memory_texts(story, f"--agent {read_agent(story, 's-9').id} --environment main") == [WORKER_FACT])


def test_a_list_with_no_agent_named_holds_every_agent_s_memories(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_rows(sorted(memory_texts(story, "--environment main")) == sorted([MAIN_FACT, WORKER_FACT]))


def test_the_list_is_searched_on_the_server(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_rows(memory_texts(story, "--search worktree --environment main") == [WORKER_FACT])
    story.expect_rows(memory_texts(story, "--search QUEUE --environment main") == [MAIN_FACT])
    story.expect_rows(memory_texts(story, "--search nothing-like-it --environment main") == [])


def test_the_list_is_ordered_by_weight_on_the_server(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success(f"memory weigh {WORKER_MEMORY} 9", actor=story.user)
    story.expect_success(f"memory weigh {MAIN_MEMORY} 3", actor=story.user)
    story.expect_rows(memory_texts(story, "--order weight --environment main") == [WORKER_FACT, MAIN_FACT])
    story.expect_success(f"memory weigh {MAIN_MEMORY} 10", actor=story.user)
    story.expect_rows(memory_texts(story, "--order weight --environment main") == [MAIN_FACT, WORKER_FACT])


def test_the_removed_memories_of_one_agent_are_listed_by_state(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success(f"memory remove {WORKER_MEMORY} --reason stale", actor=story.user)
    worker = read_agent(story, "s-9")
    story.expect_rows(memory_texts(story, f"--agent {worker.id} --removed --state removed --environment main") == [WORKER_FACT])
    story.expect_rows(memory_texts(story, f"--agent {worker.id} --state active --environment main") == [])


def test_a_list_leaves_removed_memories_out_unless_it_asks_for_them(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_success(f"memory remove {WORKER_MEMORY} --reason stale", actor=story.user)
    story.expect_rows(memory_texts(story, "--other-agents --environment main") == [])
    story.expect_rows(memory_texts(story, "--other-agents --removed --environment main") == [WORKER_FACT])
    story.expect_rows(sorted(memory_texts(story, "--removed --environment main")) == sorted([MAIN_FACT, WORKER_FACT]))


def test_an_agent_still_reads_only_its_own_memories(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.expect_refusal("memory agents --reason needed", "A person was asked in the dock", actor=story.agent)
    story.expect_text("memory list --order weight --search queue", MAIN_FACT, actor=story.agent)
    story.expect_no_text("memory list --order weight", WORKER_FACT, actor=story.agent)
