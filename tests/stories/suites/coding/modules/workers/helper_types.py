from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta
import json

import pytest

from engine.enums.access import Access
from engine.enums.agent_role import AgentRole
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.database.database import Database
from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.drivers.models.agent_line import AgentLine
from engine.scope.scopes import Scopes
from core.modules.drivers.support.suite_choice import SuiteChoice
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.suites.coding.modules.workers.support.helper_types import ClerkStarted, HelperStarted, BuilderNativeHelper, EveryHelperRule, ReaderHelpersRule, WorkerStarted

READ_SAMPLE = HookSamples.tool_use("Read", ToolType.READ, ["README.md"], None)
FIXTURES = {"helper": HelperStarted, "helper": BuilderNativeHelper, "worker": WorkerStarted, "clerk": ClerkStarted}


def test_shipped_types_restore_their_access_inheritance_and_worker_roster(new_story):
    story = new_story(fixture=CodingEnvironment)
    book = story.container.get(HelperTypeBook)
    worker = book.find("worker")
    story.expect_rows(AgentRole.HELPER.value == "helper", book.find("main").access is Access.WRITING,
                      book.find("helper").access is Access.READ, book.find("helper").label == "Read-only helper",
                      {"helper", "worker", "reviewer", "verifier"} <= set(book.helper_keys()), book.is_helper("worker"), not book.is_helper("main"),
                      book.find("reviewer").label == "Reviewer", book.find("verifier").module == "journal.suites.coding",
                      worker.access is Access.WRITING, worker.separate_folder,
                      worker.default_profile == "journal-worker", worker.start_line == "journal worker dispatch",
                      worker.roster is not None)
    story.expect_rows(story.container.get(worker.roster.loaded()).available(1) == ())
    registry = Registry.read(story.container.get(Database))
    story.expect_rows(all(driver.role in registry.role_names for driver in registry.drivers),
                      all(role in registry.role_names for rule in registry.rules for role in rule.roles))


@pytest.mark.parametrize("role", ["helper", "worker", "clerk"])
def test_an_inactive_helper_of_any_registered_descendant_type_wakes_its_parent(new_story, role):
    story = new_story(fixture=FIXTURES[role])
    helper = json.loads(story.run(f"agent list --role {role} --json").output_text)["rows"][0]
    story.advance(timedelta(minutes=15))
    story.tick("s-1")
    wanted = f"{role}:{helper['id']} has used no tool for 15 minutes"
    story.expect_text(f"agent-line list --agent {story.agent.id}", wanted)
    lines = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows()
    story.expect_rows(any(wanted in line.text and line.wakes_agent for line in lines))


def test_an_ended_helper_is_left_out_of_the_inactive_notice(new_story):
    story = new_story(fixture=HelperStarted)
    helper = json.loads(story.run("agent list --role helper --json").output_text)["rows"][0]
    story.expect_success(f"agent end {helper['id']}")
    story.advance(timedelta(minutes=15))
    story.tick("s-1")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}",
                         f"helper:{helper['id']} has used no tool")


def test_a_helper_has_saved_commands_from_its_first_start(new_story):
    story = new_story(fixture=HelperStarted)
    with story.container.get(Scopes).read_scope((), None, 1):
        policy = story.container.get(SuiteChoice).agent_policy()
    story.expect_rows("helper" in policy.saved_command_roles, "helper" in policy.saved_command_roles)


@pytest.mark.parametrize("role", ["helper", "worker", "clerk"])
def test_a_rule_that_names_the_helper_role_holds_for_a_worker_and_every_other_kind(new_story, role):
    story = new_story(fixture=EveryHelperRule)
    story.expect_hook_refusal(f"s-{role}", READ_SAMPLE, "sample rule holds for every helper")


def test_a_rule_that_names_the_helper_role_leaves_the_main_agent_alone(new_story):
    story = new_story(fixture=EveryHelperRule)
    story.expect_hook_allowed("s-1", READ_SAMPLE)


def test_a_rule_for_read_only_helpers_holds_for_a_read_only_helper(new_story):
    story = new_story(fixture=ReaderHelpersRule)
    story.expect_hook_refusal("s-helper", READ_SAMPLE, "sample rule holds for read-only helpers")


def test_a_rule_for_read_only_helpers_leaves_a_worker_alone(new_story):
    story = new_story(fixture=ReaderHelpersRule)
    story.expect_hook_allowed("s-worker", READ_SAMPLE)


def test_helper_stop_tells_a_worker_where_its_work_goes(new_story):
    story = new_story(fixture=WorkerStarted)
    worker = json.loads(story.run("agent list --role worker --json").output_text)["rows"][0]
    story.expect_refusal(f"helper stop {agent_number(story, worker['id'])}", "takes its work with journal worker send")


def test_a_wait_on_a_helper_that_is_a_worker_follows_the_worker(new_story):
    story = new_story(fixture=WorkerStarted)
    worker = json.loads(story.run("agent list --role worker --json").output_text)["rows"][0]
    story.expect_refusal(f"task block 1 --on helper:{worker['id']}", f"worker {worker['id']} has already finished")
