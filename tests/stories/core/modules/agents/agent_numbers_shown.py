import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.suites.coding.drivers.worker.worker_driver import WORKER_SESSION, WorkingAgent

MAIN_TITLE = "Main agent"
ENDED_MAIN_TITLE = "Main agent, earlier session"
NUMBER_REFUSAL = "numbers are only given"


def shown(story: Story, agent_id: int, actor: Actor | None = None) -> dict:
    return json.loads(story.run(f"agent show {agent_id} --json", actor=actor or story.user).output_text)


def listed(story: Story, environment: str = "main") -> dict[int, dict]:
    rows = json.loads(story.run(f"agent list --environment {environment} --json", actor=story.user).output_text)["rows"]
    return {row["id"]: row for row in rows}


def worker_of(story: Story, environment: str) -> int:
    return next(agent_id for agent_id, row in listed(story, environment).items() if row["role"] == "worker")


def started_worker(story: Story, session: str, environment: str, parent_id: int) -> int:
    return story.new_row_id(f"agent start {session} claude worker --parent {parent_id} --environment {environment}")


def test_a_main_agent_reads_a_workers_report_by_the_workers_number_not_its_row_id(new_story):
    story = new_story(fixture=BuilderStarted)
    worker = Actor(started_worker(story, "s-9", "main", story.agent.id), ActorType.AGENT)
    story.container.get(Bus).run(RecordParentReport(worker.id, story.agent.id, "Handed in"), worker, environment_id=1)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {story.agent.id}", "worker 2 reports in message:1")
    story.expect_absent(f"agent-line list --agent {story.agent.id}", f"agent:{worker.id} reports")


def test_an_earlier_main_session_reads_as_earlier_and_only_the_current_main_reads_main_agent(new_story):
    story = new_story(fixture=MainEnvironment)
    ended_id = story.new_row_id("agent start s-1 claude main --environment main")
    story.expect_success(f"agent end {ended_id}", actor=story.user)
    current_id = story.new_row_id("agent start s-2 claude main --environment main")
    story.expect_text(f"agent show {ended_id}", f"display_name: {ENDED_MAIN_TITLE}", actor=story.user)
    story.expect_text(f"agent show {current_id}", f"display_name: {MAIN_TITLE}", actor=story.user)
    rows = listed(story)
    story.expect_rows(rows[ended_id]["display_name"] == ENDED_MAIN_TITLE, rows[current_id]["display_name"] == MAIN_TITLE,
                      [row["display_name"] for row in rows.values()].count(MAIN_TITLE) == 1)


def test_agent_show_json_keeps_the_row_id_under_id_and_gives_the_number_beside_it(new_story):
    story = new_story(fixture=BuilderStarted)
    worker_id = started_worker(story, "s-9", "main", story.agent.id)
    agent = shown(story, worker_id)
    story.expect_rows(agent["id"] == worker_id, "number" in agent, agent["number"] == 2, agent["number"] != agent["id"])


def test_a_person_editing_an_agents_number_is_refused_and_nothing_changes(new_story):
    story = new_story(fixture=UserBuilder)
    worker_id = started_worker(story, "s-9", "main", story.agent.id)
    story.expect_refusal(f"agent edit {worker_id} --number 9", NUMBER_REFUSAL, actor=story.user)
    story.expect_refusal(f"agent edit {story.agent.id} --number 9", NUMBER_REFUSAL, actor=story.user)
    story.expect_rows(shown(story, worker_id)["number"] == 2, shown(story, story.agent.id)["number"] == 1)


def test_an_agent_changing_its_own_number_is_refused_and_nothing_is_written(new_story):
    story = new_story(fixture=UserBuilder)
    worker = Actor(started_worker(story, "s-9", "main", story.agent.id), ActorType.AGENT)
    story.expect_refusal(f"agent edit {worker.id} --number 1", NUMBER_REFUSAL, actor=worker)
    story.expect_refusal(f"agent edit {story.agent.id} --number 9", NUMBER_REFUSAL, actor=story.agent)
    story.expect_rows(shown(story, worker.id)["number"] == 2, shown(story, story.agent.id)["number"] == 1)


class TwoEnvironments(StoryFixture):
    """Main has its main agent, number 1, and a worker, number 2; shop has its own main, number 1, and
    worker, number 2."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        story.run("environment make shop /work/shop")
        started_worker(story, "s-2", "main", story.agent.id)
        shop_main_id = story.new_row_id("agent start s-3 claude main --environment shop")
        started_worker(story, "s-4", "shop", shop_main_id)

    def expect(self, story: Story) -> None:
        story.expect_success("environment show 2", "name: shop")


def test_agent_two_in_a_message_links_to_agent_two_of_the_messages_environment(new_story):
    story = new_story(fixture=TwoEnvironments)
    message_id = story.new_row_id('message send "Ask agent 2 to look at it" --environment shop', actor=story.user)
    story.run_listeners()
    story.expect_text(f"link list --source message:{message_id}", f"mentions  agent:{worker_of(story, 'shop')}", actor=story.user)
    story.expect_absent(f"link list --source message:{message_id}", f"agent:{worker_of(story, 'main')}", actor=story.user)


def test_agent_two_in_a_document_links_to_agent_two_of_the_documents_environment(new_story):
    story = new_story(fixture=TwoEnvironments)
    story.run('doc make "Shop notes" --abstract "Notes" --body "Agent 2 does the till" --environment shop', actor=story.user)
    story.run_listeners()
    story.expect_text("link list --source doc:1", f"mentions  agent:{worker_of(story, 'shop')}", actor=story.user)
    story.expect_absent("link list --source doc:1", f"agent:{worker_of(story, 'main')}", actor=story.user)


def test_every_skill_and_hook_text_that_shows_worker_send_or_helper_send_names_a_number(new_story):
    story = new_story(fixture=WorkingAgent)
    install_runner(story)
    for skill in ("journal-workers", "journal-helpers"):
        text = story.run(f"skill show {skill}", actor=story.user).output_text
        sends = [line for line in text.splitlines() if "worker send" in line or "helper send" in line]
        story.expect_rows(len(sends) > 0, all("send <number>" in line for line in sends), not any("send <n>" in line or "send <id>" in line for line in sends))
    raw_test_line = HookSamples.shell("pytest tests/cart.py", ShellPart("pytest", "test run", ["tests/cart.py"]))
    refusal = story.hook(WORKER_SESSION, raw_test_line).refusal
    story.expect_rows("journal worker send 2 --test-command" in refusal)
