import pytest

from core.modules.agents.commands.replace_agent_session.replace_agent_session import ReplaceAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.memories.support.memory_nudges import START_MEMORIES
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger_cases import MERGER_QUESTION, merger_case
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start
from suites.coding.support.shipped_profiles import MERGER_PROFILE

TIMEOUT_TEXT = "Raise the timeout of the cart test"
TIMEOUT_MEMORY = "Worker 2, task 1: advised a longer timeout for the cart test, because the fixture builds slowly"
DECISION_MEMORY = "Asked the main agent which tax applies for worker 2, task 1; recommended Dutch tax, as the brief names it"
MEMORY_LIMIT_CHARACTERS = 400
SESSION_START = HookSamples.session_start()


@pytest.fixture
def visiting(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    return merger_case(story, repository_environment(story))


def advised_with_memory(case) -> None:
    case.story.expect_success(f'merger advise {agent_number(case.story, case.worker.id)} "{TIMEOUT_TEXT}"', actor=case.merger)
    case.story.expect_success(f'memory make "{TIMEOUT_MEMORY}" --weight 5', actor=case.merger)


def merger_row(case) -> Agent:
    return case.story.container.get(Queries).query(Agent).find(case.merger.id)


def new_session(case, program: str = "", model: str = "") -> Agent:
    case.story.expect_success(f"agent end {case.merger.id}", actor=case.story.agent)
    case.story.run_listeners()
    return case.story.container.get(Bus).run(ReplaceAgentSession(case.merger.id, EndReason.LAUNCH_ROTATION, program, model), Actor.core(), environment_id=1)


@pytest.fixture
def advised(visiting):
    advised_with_memory(visiting)
    return visiting


def test_the_next_session_of_the_merger_is_told_its_memories_and_lists_the_advice(advised):
    visiting = advised
    replaced = new_session(visiting)
    reply = visiting.story.hook(replaced.session, SESSION_START)
    visiting.story.expect_rows(replaced.id == visiting.merger.id, START_MEMORIES.nudge(count=1).text in reply.lines, detail=str(reply.lines))
    visiting.story.expect_text("memory list", TIMEOUT_MEMORY, actor=visiting.merger)


def test_the_merger_writes_a_memory_of_a_decision_it_passed_to_the_main_agent(visiting):
    visiting.story.expect_success(f"{MERGER_QUESTION} --worker {agent_number(visiting.story, visiting.worker.id)}", actor=visiting.merger)
    visiting.story.expect_success(f'memory make "{DECISION_MEMORY}" --weight 5', actor=visiting.merger)
    visiting.story.expect_text("memory list", DECISION_MEMORY, actor=visiting.merger)


def test_a_visit_with_no_advice_leaves_no_memory_and_a_stop_asks_for_none(visiting):
    reply = visiting.story.hook(merger_row(visiting).session, HookSamples.stop())
    visiting.story.expect_rows(not any("memor" in line for line in reply.lines), detail=str(reply.lines))
    visiting.story.expect_absent("memory list", "Worker 2", actor=visiting.merger)


def test_a_memory_longer_than_the_limit_is_refused(visiting):
    visiting.story.expect_refusal(f'memory make "{"a" * (MEMORY_LIMIT_CHARACTERS + 1)}"', f"{MEMORY_LIMIT_CHARACTERS} characters", actor=visiting.merger)


def test_the_merger_removes_a_memory_of_a_merged_worker_and_the_list_drops_it(advised):
    visiting = advised
    visiting.story.expect_success('memory remove 1 --reason "Worker 2 is merged"', actor=visiting.merger)
    visiting.story.expect_absent("memory list", TIMEOUT_MEMORY, actor=visiting.merger)


def test_the_merger_lists_its_memory_of_the_advice_and_a_worker_and_the_main_agent_never_do(advised):
    visiting = advised
    visiting.story.expect_text("memory list", TIMEOUT_MEMORY, actor=visiting.merger)
    visiting.story.expect_absent("memory list", TIMEOUT_MEMORY, actor=visiting.worker)
    visiting.story.expect_absent("memory list", TIMEOUT_MEMORY, actor=visiting.story.agent)


def test_a_memory_of_the_merger_is_kept_when_its_next_session_runs_on_codex(advised):
    visiting = advised
    replaced = new_session(visiting, "codex", "gpt-6.1-terra")
    visiting.story.expect_rows(replaced.program == "codex", replaced.id == visiting.merger.id)
    visiting.story.expect_text("memory list", TIMEOUT_MEMORY, actor=visiting.merger)


def test_the_merger_profile_says_to_read_its_memories_and_to_write_one_after_each_advice(visiting):
    visiting.story.expect_text(f"profile show {MERGER_PROFILE.name} --json", "journal memory list", "journal memory make", "one memory", actor=visiting.story.agent)


def test_the_first_session_of_the_merger_has_no_memory_and_its_start_is_told_of_none(visiting):
    reply = visiting.story.hook(merger_row(visiting).session, SESSION_START)
    visiting.story.expect_rows(not any(START_MEMORIES.nudge(count=count).text in reply.lines for count in (0, 1)), detail=str(reply.lines))
    visiting.story.expect_absent("memory list", "Worker 2", actor=visiting.merger)
