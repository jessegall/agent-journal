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
from tests.stories.core.modules.documents.support.trail_fixtures import Trail, feature, pending, read_source_ids, selected_trail as trail, trail as unselected_trail, viewer_answer
from tests.stories.server.support.go_build import GoBuild
from tests.stories.server.support.client_binary import ROOT
from tests.stories.server.support.server_client import server_story
from tests.stories.core.modules.library.support.copy_stories import new_item, shared_server
from tests.stories.core.modules.secrets.support.private_home import private_folder


@pytest.fixture
def source_server(unselected_trail):
    with server_story(unselected_trail.story, listener_thread_started=False) as server:
        yield server


@pytest.fixture
def provisional_thanks(unselected_trail):
    unselected_trail.person("messages.chat", "message", "send", "thanks")
    unselected_trail.select(3)
    return unselected_trail


@pending(6886)
def test_comment_request_creates_task_plan_doc_and_report(trail):
    trail.make_task()
    trail.command('plan make "Requested plan" --environment main')
    trail.command('doc make "Requested design" --abstract "Design" --body "Details"')
    trail.command('report make "Requested report" --abstract "Evidence" --body "Checked"')
    for target in ("task:2", "plan:2", "doc:2", "report:1"):
        trail.expect_link("message:2", target, "about")


@pending(6886)
def test_a_selected_source_survives_more_than_two_minutes(trail):
    trail.story.advance(timedelta(hours=2))
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")


@pytest.mark.parametrize("field,text", [("brief", "Apply precise rounding"), ("title", "Rounded cart"), ("outcome", "An explicit revised outcome")])
@pending(6886)
def test_direct_text_edits_keep_about_and_edited(trail, field, text):
    command = f"task edit 1 --{field} {shlex.quote(text)}"
    trail.command(command)
    trail.command(command)
    trail.expect_link("message:2", "task:1", "about")
    trail.expect_link("message:2", "task:1", "edited")


@pytest.mark.parametrize("move", ["task start 1", 'task cancel 1 --reason "No longer needed"'])
def test_close_reopen_and_other_moves_do_not_claim_a_request(trail, move):
    trail.command(move)
    assert not any(row["target_model"] == "task" and row["target_id"] == 1 for row in trail.links("message:2"))


def test_person_made_work_has_no_borrowed_source(trail):
    trail.person("tasks.tasks", "task", "make", "Person made work", "--brief", "Direct action")
    assert not any(row["target_model"] == "task" and row["target_id"] == 2 for row in trail.links("message:2"))


@pending(6886)
def test_immediate_start_sees_committed_source(trail):
    trail.make_task()
    trail.command("task start 2")
    answer = trail.requested_command("task overview 2")
    feature("Implement the cart request" in answer.output_text, answer.output_text)


def test_first_single_read_can_select_but_batch_read_does_not(unselected_trail):
    trail = unselected_trail
    trail.command("message unread")
    trail.make_task("After batch")
    feature(trail.source_ids(trail.story.agent.id) == (), "batch unread selected a source")
    trail.select()
    trail.make_task("After single read")
    trail.expect_source(2)


def test_routine_rereads_preserve_active_source(trail):
    trail.select(1)
    trail.make_task()
    trail.expect_source(2)


def test_work_from_selects_an_older_request(trail):
    trail.switch(1)
    trail.make_task()
    trail.expect_source(1)


def test_thanks_does_not_replace_active_request(trail):
    trail.person("messages.chat", "message", "send", "thanks")
    trail.select(3)
    trail.command('message react 3 "👍"')
    trail.make_task()
    trail.expect_source(2)


def test_compaction_keeps_source_and_new_agent_starts_without_one(trail):
    trail.story.hook("s-1", HookSamples.sample("compact"))
    trail.make_task()
    trail.expect_source(2)
    replacement = hook_agent(trail.story, trail.story.hook("replacement-main", HookSamples.session_start()))
    trail.expect_source(2)
    feature(trail.source_ids(replacement.id) == (), "replacement agent inherited another agent's selected source")


def test_deleting_selected_message_clears_source(trail):
    trail.person("messages.chat", "message", "send", "Unread request to delete")
    trail.switch(3)
    trail.person("messages.chat", "message", "delete", "3")
    trail.make_task()
    trail.expect_no_link("message:3", "task:2")
    feature(trail.source_ids(trail.story.agent.id) == (), "deleted source remains selected")


@pytest.mark.parametrize("number", [999, 0, -1])
def test_invalid_sources_leave_no_partial_write(trail, number):
    result = trail.story.run(f"message work-from {number}", actor=trail.story.agent)
    feature(result.code == 1, result.output_text)
    trail.make_task()
    trail.expect_source(2)


def test_single_read_and_make_on_one_shell_line_uses_source(source_server):
    trail = Trail(source_server.story)
    binary = GoBuild.built("journal", trail.story.home.folder.parent / "journal-client")
    line = 'journal message read 2 && journal task make "Same shell cart task" --environment main'
    sample = HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "2"]),
                               ShellPart("journal", CommandCategory.JOURNAL, ["task", "make", "Same shell cart task", "--environment", "main"]))
    trail.story.expect_hook_allowed("s-1", sample)
    command = f'{shlex.quote(str(binary))} message read 2 && {shlex.quote(str(binary))} task make "Same shell cart task" --environment main'
    environment = GoBuild.environment(JOURNAL_HOME=str(trail.story.home.folder), JOURNAL_SOURCE=str(ROOT / "src"), JOURNAL_AGENT_SESSION="s-1", JOURNAL_ENV="main")
    selected_at_creation = []
    save = Repository.save
    registry = trail.story.container.get(Registry)

    def record_task_source(repository, model, context):
        if isinstance(model, Task):
            selected_at_creation.append(read_source_ids(repository.queries, registry, context.actor.id))
        return save(repository, model, context)

    with patch.object(Repository, "save", record_task_source):
        completed = subprocess.run(["bash", "-c", command], env=environment, cwd=trail.story.home.folder.parent, capture_output=True, text=True, timeout=30)
    assert completed.returncode == 0, (completed.stdout, completed.stderr)
    feature(selected_at_creation == [(2,)], f"source at same-line task creation was {selected_at_creation}")
    trail.story.expect_hook_allowed("s-1", sample.with_fields(event="post_tool_use"))
    trail.expect_source(2)


def test_competing_source_selections_leave_one_valid_version(source_server):
    trail = Trail(source_server.story)
    with ThreadPoolExecutor(max_workers=2) as workers:
        outcomes = list(workers.map(lambda number: source_server.run_as(f"message work-from {number}", "s-1"), [1, 2]))
    feature(all(outcome.exit_code == 0 for outcome in outcomes), repr(outcomes))
    selected = trail.source_rows(trail.story.agent.id)
    feature(len(selected) == 1 and selected[0].message_id in (1, 2) and selected[0].version >= 1, repr(selected))
    trail.make_task()
    trail.expect_source(selected[0].message_id)


def test_close_and_reopen_do_not_claim_a_request(trail):
    trail.command("task start 1")
    trail.command('task close 1 --outcome "Complete cart work"')
    trail.command("task reopen 1")
    assert not any(row["target_model"] == "task" and row["target_id"] == 1 for row in trail.links("message:2"))


@pytest.mark.usefixtures("private_folder")
def test_imports_and_library_copies_do_not_acquire_sources(trail, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Imported cart design", "An independently authored library document")
    trail.person("library.teams", "library", "connect", server.address, "--token", tokens.editor)
    trail.person("library.teams", "library", "get", "doc", str(item_id))
    assert not any(row["target_model"] == "doc" and row["target_id"] == 2 for row in trail.links("message:2"))


def test_task_named_in_reply_retains_existing_behaviour(trail):
    trail.command('message reply 2 "Continue task 1"')
    trail.story.run_listeners()
    assert any(row["target_model"] == "task" and row["target_id"] == 1 and row["link_type"] == "about" for row in trail.links("message:2"))


def test_reacting_to_unused_provisional_acknowledgement_clears_only_that_source(provisional_thanks):
    trail = provisional_thanks
    trail.expect_source(3)
    trail.command('message react 3 "👍"')
    feature(trail.source_ids(trail.story.agent.id) == (), "unused provisional acknowledgement is still selected")


def test_reply_explicitly_switches_the_active_request(trail):
    trail.command('message reply 1 "I will handle the original request now"')
    trail.story.advance(timedelta(minutes=3))
    trail.make_task()
    trail.expect_source(1)


@pytest.mark.parametrize("environment,session", [("main", "other-main"), ("side", "side-main")], ids=["another-addressee", "another-environment"])
def test_unauthorized_source_does_not_replace_the_active_request(trail, environment, session, tmp_path):
    if environment != "main":
        folder = tmp_path / environment
        folder.mkdir()
        trail.story.expect_success(f"environment make {environment} {shlex.quote(str(folder))}")
    target = trail.story.new_row_id(f"agent start {session} claude main --environment {environment}")
    answer = viewer_answer(trail.story, "messages.chat", ["message", "send", "Another agent's private request", "--target-agent", str(target)], environment)
    assert answer.code == 0, answer.error
    result = trail.story.run(f'message work-from {answer.value["id"]}', actor=trail.story.agent)
    feature(result.code == 1, result.output_text)
    trail.make_task()
    trail.expect_source(2)


def test_reading_an_agent_message_does_not_select_a_person_request(unselected_trail):
    trail = unselected_trail
    trail.command('message send "Agent progress only"')
    trail.select(3)
    assert trail.source_ids(trail.story.agent.id) == ()


def test_work_from_rejects_a_non_person_message(trail):
    trail.command('message send "Agent progress only"')
    result = trail.story.run("message work-from 3", actor=trail.story.agent)
    feature(result.code == 1, result.output_text)
    trail.expect_source(2)
