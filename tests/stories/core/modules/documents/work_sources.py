from datetime import timedelta
from concurrent.futures import ThreadPoolExecutor
import shlex
import subprocess
from unittest.mock import patch

import pytest

from core.testing.hook_samples import HookSamples
from core.base.driver.command_category import CommandCategory
from core.testing.shell_part import ShellPart
from core.base.repository.repository import Repository
from core.base.registry.registry import Registry
from core.modules.tasks.models.task import Task
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.modules.documents.support.trail_fixtures import Scenario, feature, pending, read_source_ids, selected_scenario as scenario, scenario as unselected_scenario, viewer_answer
from tests.stories.server.support.go_build import GoBuild
from tests.stories.server.support.client_binary import ROOT
from tests.stories.server.support.server_client import server_story
from tests.stories.core.modules.library.support.copy_stories import new_item, shared_server
from tests.stories.core.modules.secrets.support.private_home import private_folder


@pytest.fixture
def source_server(unselected_scenario):
    with server_story(unselected_scenario.story, listener_thread_started=False) as server:
        yield server


@pytest.fixture
def provisional_thanks(unselected_scenario):
    unselected_scenario.person("messages.chat", "message", "send", "thanks")
    unselected_scenario.select(3)
    return unselected_scenario


def test_comment_request_creates_task_plan_doc_and_report(scenario):
    scenario.make_task()
    scenario.command('plan make "Requested plan" --environment main')
    scenario.command('doc make "Requested design" --abstract "Design" --body "Details"')
    scenario.command('report make "Requested report" --abstract "Evidence" --body "Checked"')
    for target in ("task:2", "plan:2", "doc:2", "report:1"):
        scenario.expect_link("message:2", target, "about")


def test_a_selected_source_survives_more_than_two_minutes(scenario):
    scenario.story.advance(timedelta(hours=2))
    scenario.make_task()
    scenario.expect_link("message:2", "task:2", "about")


@pytest.mark.parametrize("field,text", [("brief", "Apply precise rounding"), ("title", "Rounded cart"), ("outcome", "An explicit revised outcome")])
def test_direct_text_edits_keep_about_and_edited(scenario, field, text):
    command = f"task edit 1 --{field} {shlex.quote(text)}"
    scenario.command(command)
    scenario.command(command)
    scenario.expect_link("message:2", "task:1", "about")
    scenario.expect_link("message:2", "task:1", "edited")


@pytest.mark.parametrize("move", ["task start 1", 'task cancel 1 --reason "No longer needed"'])
def test_close_reopen_and_other_moves_do_not_claim_a_request(scenario, move):
    scenario.command(move)
    scenario.story.expect_rows(not any(row["target_model"] == "task" and row["target_id"] == 1 for row in scenario.links("message:2")))


def test_person_made_work_has_no_borrowed_source(scenario):
    scenario.person("tasks.tasks", "task", "make", "Person made work", "--brief", "Direct action")
    scenario.story.expect_rows(not any(row["target_model"] == "task" and row["target_id"] == 2 for row in scenario.links("message:2")))


def test_immediate_start_sees_committed_source(scenario):
    scenario.make_task()
    scenario.expect_link("message:2", "task:2", "about")
    scenario.command("task start 2")
    answer = scenario.requested_command("task overview 2")
    feature("Implement the cart request" in answer.output_text, answer.output_text)


def test_refused_resource_save_does_not_consume_the_selected_request(scenario):
    refused = scenario.story.run('task make "" --environment main', actor=scenario.story.agent)
    scenario.story.expect_rows(refused.code == 1, detail=refused.output_text)
    selected = scenario.source_rows(scenario.story.agent.id)
    feature(len(selected) == 1 and not selected[0].used, "refused save consumed the selected request")
    scenario.make_task()
    scenario.expect_link("message:2", "task:2", "about")
    selected = scenario.source_rows(scenario.story.agent.id)
    feature(selected[0].used, "successful save did not consume provisional selection")


def test_first_single_read_can_select_but_batch_read_does_not(unselected_scenario):
    scenario = unselected_scenario
    scenario.command("message unread")
    scenario.make_task("After batch")
    feature(scenario.source_ids(scenario.story.agent.id) == (), "batch unread selected a source")
    scenario.select()
    scenario.make_task("After single read")
    scenario.expect_source(2)


def test_routine_rereads_preserve_active_source(scenario):
    scenario.select(1)
    scenario.make_task()
    scenario.expect_source(2)


def test_work_from_selects_an_older_request(scenario):
    scenario.switch(1)
    scenario.make_task()
    scenario.expect_source(1)


def test_thanks_does_not_replace_active_request(scenario):
    scenario.person("messages.chat", "message", "send", "thanks")
    scenario.select(3)
    scenario.command('message react 3 "👍"')
    scenario.make_task()
    scenario.expect_source(2)


def test_compaction_keeps_source_and_new_agent_starts_without_one(scenario):
    scenario.story.hook("s-1", HookSamples.sample("compact"))
    scenario.make_task()
    scenario.expect_source(2)
    replacement = hook_agent(scenario.story, scenario.story.hook("replacement-main", HookSamples.session_start()))
    scenario.expect_source(2)
    feature(scenario.source_ids(replacement.id) == (), "replacement agent inherited another agent's selected source")


def test_deleting_selected_message_clears_source(scenario):
    scenario.person("messages.chat", "message", "send", "Unread request to delete")
    scenario.switch(3)
    scenario.person("messages.chat", "message", "delete", "3")
    scenario.make_task()
    scenario.expect_no_link("message:3", "task:2")
    feature(scenario.source_ids(scenario.story.agent.id) == (), "deleted source remains selected")


@pytest.mark.parametrize("number", [999, 0, -1])
def test_invalid_sources_leave_no_partial_write(scenario, number):
    outcome = scenario.story.run(f"message work-from {number}", actor=scenario.story.agent)
    feature(outcome.code == 1, outcome.output_text)
    scenario.make_task()
    scenario.expect_source(2)


def test_single_read_and_make_on_one_shell_line_uses_source(source_server):
    scenario = Scenario(source_server.story)
    binary = GoBuild.built("journal", scenario.story.home.folder.parent / "journal-client")
    line = 'journal message read 2 && journal task make "Same shell cart task" --environment main'
    sample = HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "2"]),
                               ShellPart("journal", CommandCategory.JOURNAL, ["task", "make", "Same shell cart task", "--environment", "main"]))
    scenario.story.expect_hook_allowed("s-1", sample)
    command = f'{shlex.quote(str(binary))} message read 2 && {shlex.quote(str(binary))} task make "Same shell cart task" --environment main'
    environment = GoBuild.environment(JOURNAL_HOME=str(scenario.story.home.folder), JOURNAL_SOURCE=str(ROOT / "src"), JOURNAL_AGENT_SESSION="s-1", JOURNAL_ENV="main")
    creation_sources = []
    save = Repository.save
    registry = scenario.story.container.get(Registry)

    def record_task_source(repository, model, context):
        if isinstance(model, Task):
            creation_sources.append(read_source_ids(repository.queries, registry, context.actor.id))
        return save(repository, model, context)

    with patch.object(Repository, "save", record_task_source):
        completed = subprocess.run(["bash", "-c", command], env=environment, cwd=scenario.story.home.folder.parent, capture_output=True, text=True, timeout=30)
    scenario.story.expect_rows(completed.returncode == 0, detail=(completed.stdout, completed.stderr))
    feature(creation_sources == [tuple([2])], f"source at same-line task creation was {creation_sources}")
    scenario.story.expect_hook_allowed("s-1", sample.with_fields(event="post_tool_use"))
    scenario.expect_source(2)


def test_competing_source_selections_leave_one_valid_version(source_server):
    scenario = Scenario(source_server.story)
    with ThreadPoolExecutor(max_workers=2) as workers:
        outcomes = list(workers.map(lambda number: source_server.run_as(f"message work-from {number}", "s-1"), [1, 2]))
    feature(all(outcome.exit_code == 0 for outcome in outcomes), repr(outcomes))
    selected = scenario.source_rows(scenario.story.agent.id)
    feature(len(selected) == 1 and selected[0].message_id in (1, 2) and selected[0].version >= 1, repr(selected))
    scenario.make_task()
    scenario.expect_source(selected[0].message_id)


def test_close_and_reopen_do_not_claim_a_request(scenario):
    scenario.command("task start 1")
    scenario.command('task close 1 --outcome "Complete cart work"')
    scenario.command("task reopen 1")
    scenario.story.expect_rows(not any(row["target_model"] == "task" and row["target_id"] == 1 for row in scenario.links("message:2")))


@pytest.mark.usefixtures("private_folder")
def test_imports_and_library_copies_do_not_acquire_sources(scenario, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Imported cart design", "An independently authored library document")
    scenario.person("library.teams", "library", "connect", server.address, "--token", tokens.editor)
    scenario.person("library.teams", "library", "get", "doc", str(item_id))
    scenario.story.expect_rows(not any(row["target_model"] == "doc" and row["target_id"] == 2 for row in scenario.links("message:2")))


def test_task_named_in_reply_retains_existing_behaviour(scenario):
    scenario.command('message reply 2 "Continue task 1"')
    scenario.story.run_listeners()
    scenario.story.expect_rows(any(row["target_model"] == "task" and row["target_id"] == 1 and row["link_type"] == "about" for row in scenario.links("message:2")))


def test_reacting_to_unused_provisional_acknowledgement_clears_only_that_source(provisional_thanks):
    scenario = provisional_thanks
    scenario.expect_source(3)
    scenario.command('message react 3 "👍"')
    feature(scenario.source_ids(scenario.story.agent.id) == (), "unused provisional acknowledgement is still selected")


def test_reply_explicitly_switches_the_active_request(scenario):
    scenario.command('message reply 1 "I will handle the original request now"')
    scenario.story.advance(timedelta(minutes=3))
    scenario.make_task()
    scenario.expect_source(1)


@pytest.mark.parametrize("environment,session", [("main", "other-main"), ("side", "side-main")], ids=["another-addressee", "another-environment"])
def test_unauthorized_source_does_not_replace_the_active_request(scenario, environment, session, tmp_path):
    if environment != "main":
        folder = tmp_path / environment
        folder.mkdir()
        scenario.story.expect_success(f"environment make {environment} {shlex.quote(str(folder))}")
    target = scenario.story.new_row_id(f"agent start {session} claude main --environment {environment}")
    answer = viewer_answer(scenario.story, "messages.chat", ["message", "send", "Another agent's private request", "--target-agent", str(target)], environment)
    scenario.story.expect_rows(answer.code == 0, detail=answer.error)
    outcome = scenario.story.run(f'message work-from {answer.value["id"]}', actor=scenario.story.agent)
    feature(outcome.code == 1, outcome.output_text)
    scenario.make_task()
    scenario.expect_source(2)


def test_reading_an_agent_message_does_not_select_a_person_request(unselected_scenario):
    scenario = unselected_scenario
    scenario.command('message send "Agent progress only"')
    scenario.select(3)
    scenario.story.expect_rows(scenario.source_ids(scenario.story.agent.id) == ())


def test_work_from_rejects_a_non_person_message(scenario):
    scenario.command('message send "Agent progress only"')
    outcome = scenario.story.run("message work-from 3", actor=scenario.story.agent)
    feature(outcome.code == 1, outcome.output_text)
    scenario.expect_source(2)
