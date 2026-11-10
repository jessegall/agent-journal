import pytest
from unittest.mock import patch
from engine.change.event_log import EventLog
from engine.query.query import Query
from engine.listener.commit_listener_runner import CommitListenerRunner
from engine.command.bus import Bus
from engine.module.module_actors import ModuleActors
from core.modules.documents.commands.record_mentions.record_mentions import RecordMentions
from core.modules.documents.references.row_ref import RowRef
from tests.stories.core.modules.library.support.copy_stories import new_item, shared_server
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.suites.coding.modules.workers.worker_context import assigned_worker, worker_scenario

from tests.stories.core.modules.documents.support.trail_fixtures import Scenario, feature, scenario
from tests.stories.core.support.plan_steps import state_tasks_wait_on_nothing


def test_viewer_comment_keeps_its_original_target(scenario):
    rows = scenario.person("messages.chat", "message", "feed")["rows"]
    comment = next(row for row in rows if row["id"] == 2)
    scenario.story.expect_rows(comment["commented_row"] == "message:1")
    scenario.story.expect_rows(comment["text"] == "Implement the cart request")


def test_duplicate_transcription_link_is_idempotent(scenario):
    scenario.command('transcription make "Cart meeting" --text "Discuss totals" --environment main')
    scenario.requested_command("transcription link 1 task 1")
    scenario.requested_command("transcription link 1 task 1")
    feature(len([row for row in scenario.links("transcription:1") if row["target_id"] == 1 and row["target_model"] == "task"]) == 1, "duplicate transcription subject")


def test_deleted_sources_are_not_relinked_by_deferred_events(scenario):
    with patch.object(CommitListenerRunner, "run", return_value=None):
        scenario.command('task make "Will be deleted" --brief "doc 1" --environment main')
        scenario.command("task delete 2")
    scenario.story.run_listeners()
    actor = scenario.story.container.get(ModuleActors).actor("journal.core.documents")
    scenario.story.container.get(Bus).run(RecordMentions(RowRef("task", 2), ["doc 1"]), actor, environment_id=1)
    feature(scenario.links("task:2") == [], "deferred save recreated deleted source links")


def test_deleting_a_row_removes_touching_links(scenario):
    scenario.command('task edit 1 --brief "doc 1"')
    scenario.story.run_listeners()
    scenario.command("task delete 1")
    feature(scenario.links("task:1") == [], "deletion retained outgoing mentions")


def test_prose_field_updates_keep_old_mentions(scenario):
    scenario.command("task start 1")
    scenario.command('task close 1 --outcome "See doc 1"')
    scenario.story.run_listeners()
    scenario.command("task reopen 1")
    scenario.expect_link("task:1", "doc:1", "mentions")


def test_long_text_scanning_batches_distinct_references(scenario):
    for number in range(2, 42):
        scenario.make_task(f"Cart item {number}")
    text = " ".join(f"task {number}" for number in range(1, 42))
    with patch.object(Query, "exists", autospec=True, side_effect=Query.exists) as exists:
        scenario.command(f'doc make "Many references" --abstract "Batch" --body "{text}"')
        scenario.story.run_listeners()
    rows = scenario.links("doc:2")
    feature(len([row for row in rows if row["target_model"] == "task"]) == 41, "scanner lost distinct valid references")
    task_lookups = [call for call in exists.call_args_list if call.args[0].model.model_name == "task"]
    feature(len(task_lookups) <= 4, f"scanner made {len(task_lookups)} per-task existence queries for one batch")


def test_new_link_events_run_once_and_duplicates_run_none(scenario):
    scenario.command('transcription make "Event count" --text "Cart meeting" --environment main')
    scenario.requested_command("transcription link 1 task 1")
    edge = next(row for row in scenario.links("transcription:1") if row["target_model"] == "task" and row["target_id"] == 1)
    scenario.requested_command("transcription link 1 task 1")
    events = scenario.story.container.get(EventLog).row_events("links", edge["id"])
    feature(len([event for event in events if event.is_creation]) == 1, "duplicate link emitted another creation event")


@pytest.mark.usefixtures("private_folder")
def test_library_copies_are_not_scanned(scenario, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Foreign cart notes", "task 1")
    scenario.person("library.teams", "library", "connect", server.address, "--token", tokens.editor)
    scenario.person("library.teams", "library", "get", "doc", str(item_id))
    scenario.story.expect_rows(not any(row["target_model"] == "task" and row["target_id"] == 1 for row in scenario.links("doc:2")))


@pytest.mark.parametrize("commands,source", [(("phase make --plan 1 'Cart phase'", "phase edit 1 --goal 'Read doc 1'"), "phase:1"),
                                           (("phase make --plan 1 'Cart phase'", "phase edit 1 --title 'Read doc 1'"), "phase:1"),
                                           (["task log 1 'Read doc 1'"], "task_log:1"),
                                           (("task log 1 'First observation'", "task-log edit 1 --line 'Read doc 1'"), "task_log:1")],
                         ids=["phase-goal", "phase-title", "task-log-line", "task-log-update"])
def test_additional_prose_sources_are_scanned_on_updates(scenario, commands, source):
    for command in commands:
        scenario.command(command)
    scenario.expect_link(source, "doc:1", "mentions")


def test_delegated_comment_and_review_link_side_effects_remain(assigned_worker):
    scenario, worker = assigned_worker.scenario, assigned_worker.worker
    comment = scenario.comment("viewer.shell", "task", 1, "Review the cart totals")
    rows = scenario.links(f'message:{comment["id"]}')
    scenario.story.expect_rows(any(row["link_type"] == "sent_to" and row["target_model"] == "agent" and row["target_id"] == worker.id for row in rows))
    scenario.command('template make "Read the plan" --brief "Find mistakes" --applies-to plan --purpose critique')
    templates = scenario.person("templates.templates", "template", "list")["rows"]
    template_id = next(row["id"] for row in templates if row["title"] == "Read the plan")
    state_tasks_wait_on_nothing(scenario.story, scenario.story.agent, 1)
    scenario.command("plan ready 1")
    scenario.person("messages.chat", "template", "send", str(template_id), "--on=plan:1", "--set=agents=2 agents", "--set=size=a normal read")
    scenario.command('report make "Plan review" --abstract "Reviewed" --body "Looks correct" --about plan:1')
    scenario.story.run_listeners()
    scenario.story.expect_rows("state: ready" in scenario.command("plan show 1").output_text)


@pytest.mark.parametrize("command,source", [
    ("task edit 1 --title 'Read doc 1'", "task:1"),
    ("task edit 1 --brief 'Read doc 1'", "task:1"),
    ("plan edit 1 --title 'Read doc 1'", "plan:1"),
    ("plan edit 1 --brief 'Read doc 1'", "plan:1"),
    ("doc make 'Read doc 1' --abstract Notes --body Text", "doc:2"),
    ("doc make Notes --abstract 'Read doc 1' --body Text", "doc:2"),
    ("doc make Notes --abstract Notes --body 'Read doc 1'", "doc:2"),
    ("report make 'Read doc 1' --abstract Notes --body Text", "report:1"),
    ("report make Notes --abstract 'Read doc 1' --body Text", "report:1"),
    ("report make Notes --abstract Notes --body 'Read doc 1'", "report:1"),
], ids=["task-title", "task-brief", "plan-title", "plan-brief", "doc-title", "doc-abstract", "doc-body", "report-title", "report-abstract", "report-body"])
def test_existing_prose_fields_keep_their_mentions(scenario, command, source):
    scenario.command(command)
    scenario.story.run_listeners()
    scenario.expect_link(source, "doc:1", "mentions")
