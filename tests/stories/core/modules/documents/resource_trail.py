import pytest
from unittest.mock import patch
from concurrent.futures import ThreadPoolExecutor

from core.base.change.event_log import EventLog
from core.base.database.repeated_calls_error import RepeatedCallsError
from core.base.query.query import Query
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.modules.documents.commands.record_mentions.record_mentions import RecordMentions
from core.modules.documents.support.row_ref import RowRef
from tests.stories.core.modules.library.support.copy_stories import new_item, shared_server
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.suites.coding.modules.workers.worker_context import assigned_worker, worker_trail

from tests.stories.core.modules.documents.support.trail_fixtures import MissingTrailBehaviour, Trail, feature, pending, trail
from tests.stories.server.support.server_client import server_story


@pytest.fixture
def link_server(trail):
    trail.command('transcription make "Concurrent requests" --text "Cart meeting" --environment main')
    with server_story(trail.story, listener_thread_started=False) as server:
        yield server


def test_viewer_comment_keeps_its_original_target(trail):
    rows = trail.person("messages.chat", "message", "feed")["rows"]
    comment = next(row for row in rows if row["id"] == 2)
    assert comment["commented_row"] == "message:1"
    assert comment["text"] == "Implement the cart request"


def test_link_types_can_share_endpoints(trail):
    comment = trail.comment("viewer.shell", "task", 1, "Review task 1")
    trail.story.run_listeners()
    rows = trail.links(f'message:{comment["id"]}')
    relations = {row["link_type"] for row in rows if row["target_model"] == "task" and row["target_id"] == 1}
    assert {"comments_on", "mentions"} <= relations


@pending(6846)
def test_duplicate_transcription_link_is_idempotent(trail):
    trail.command('transcription make "Cart meeting" --text "Discuss totals" --environment main')
    trail.requested_command("transcription link 1 task 1")
    trail.requested_command("transcription link 1 task 1")
    feature(len([row for row in trail.links("transcription:1") if row["target_id"] == 1 and row["target_model"] == "task"]) == 1, "duplicate transcription subject")


@pending(6885)
def test_fields_cannot_manufacture_a_reference(trail):
    trail.command('doc make "task" --abstract "1" --body "No reference"')
    trail.expect_no_link("doc:2", "task:1")


@pending(6885)
def test_deleted_sources_are_not_relinked_by_deferred_events(trail):
    with patch.object(CommitListenerRunner, "run", return_value=None):
        trail.command('task make "Will be deleted" --brief "doc 1" --environment main')
        trail.command("task delete 2")
    trail.story.run_listeners()
    actor = trail.story.container.get(ModuleActors).actor("journal.core.documents")
    trail.story.container.get(Bus).run(RecordMentions(RowRef("task", 2), "doc 1"), actor, environment_id=1)
    feature(trail.links("task:2") == [], "deferred save recreated deleted source links")


@pending(6885)
def test_deleting_a_row_removes_touching_links(trail):
    trail.command('task edit 1 --brief "doc 1"')
    trail.story.run_listeners()
    trail.command("task delete 1")
    feature(trail.links("task:1") == [], "deletion retained outgoing mentions")


@pending(6885)
def test_prose_field_updates_keep_old_mentions(trail):
    trail.command("task start 1")
    trail.command('task close 1 --outcome "See doc 1"')
    trail.story.run_listeners()
    trail.command("task reopen 1")
    trail.expect_link("task:1", "doc:1", "mentions")


@pytest.mark.parametrize("text", ["task 1.5", "task 1-2", "other-task 1"], ids=["decimal", "range", "embedded-name"])
@pending(6885)
def test_malformed_reference_tokens_are_ignored(trail, text):
    trail.command(f'doc make "Malformed reference" --abstract "Tokens" --body "{text}; plan 1"')
    trail.expect_no_link("doc:2", "task:1")
    trail.expect_link("doc:2", "plan:1", "mentions")


@pytest.mark.xfail(strict=True, raises=(MissingTrailBehaviour, RepeatedCallsError), reason="plan 1093 task 6885: batch scanner lookups")
def test_long_text_scanning_batches_distinct_references(trail):
    for number in range(2, 42):
        trail.make_task(f"Cart item {number}")
    text = " ".join(f"task {number}" for number in range(1, 42))
    with patch.object(Query, "exists", autospec=True, side_effect=Query.exists) as exists:
        trail.command(f'doc make "Many references" --abstract "Batch" --body "{text}"')
        trail.story.run_listeners()
    rows = trail.links("doc:2")
    feature(len([row for row in rows if row["target_model"] == "task"]) == 41, "scanner lost distinct valid references")
    task_lookups = [call for call in exists.call_args_list if call.args[0].model.model_name == "task"]
    feature(len(task_lookups) <= 4, f"scanner made {len(task_lookups)} per-task existence queries for one batch")


@pending(6846)
def test_new_link_events_run_once_and_duplicates_run_none(trail):
    trail.command('transcription make "Event count" --text "Cart meeting" --environment main')
    trail.requested_command("transcription link 1 task 1")
    edge = next(row for row in trail.links("transcription:1") if row["target_model"] == "task" and row["target_id"] == 1)
    trail.requested_command("transcription link 1 task 1")
    events = trail.story.container.get(EventLog).row_events("links", edge["id"])
    feature(len([event for event in events if event.is_creation]) == 1, "duplicate link emitted another creation event")


@pending(6846)
def test_replayed_and_competing_writes_keep_one_typed_link(link_server):
    trail = Trail(link_server.story)
    with ThreadPoolExecutor(max_workers=2) as workers:
        outcomes = list(workers.map(lambda _: link_server.run_as("transcription link 1 task 1", "s-1"), range(3)))
    feature(all(outcome.exit_code == 0 for outcome in outcomes), repr(outcomes))
    feature(len([row for row in trail.links("transcription:1") if row["target_model"] == "task" and row["target_id"] == 1]) == 1, "replayed write duplicated its typed identity")


@pytest.mark.usefixtures("private_folder")
def test_library_copies_are_not_scanned(trail, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Foreign cart notes", "task 1")
    trail.person("library.teams", "library", "connect", server.address, "--token", tokens.editor)
    trail.person("library.teams", "library", "get", "doc", str(item_id))
    assert not any(row["target_model"] == "task" and row["target_id"] == 1 for row in trail.links("doc:2"))


@pytest.mark.parametrize("commands,source", [(("phase make --plan 1 'Cart phase'", "phase edit 1 --goal 'Read doc 1'"), "phase:1"),
                                           (("phase make --plan 1 'Cart phase'", "phase edit 1 --title 'Read doc 1'"), "phase:1"),
                                           (("task log 1 'Read doc 1'",), "task_log:1"),
                                           (("task log 1 'First observation'", "task-log edit 1 --line 'Read doc 1'"), "task_log:1")],
                         ids=["phase-goal", "phase-title", "task-log-line", "task-log-update"])
@pending(6885)
def test_additional_prose_sources_are_scanned_on_updates(trail, commands, source):
    for command in commands:
        trail.command(command)
    trail.expect_link(source, "doc:1", "mentions")


@pending(6885)
def test_message_edits_are_scanned(trail):
    trail.person("messages.chat", "message", "edit", "1", "--text", "Read doc 1")
    trail.expect_link("message:1", "doc:1", "mentions")


def test_delegated_comment_and_review_link_side_effects_remain(assigned_worker):
    trail, worker = assigned_worker.trail, assigned_worker.worker
    comment = trail.comment("viewer.shell", "task", 1, "Review the cart totals")
    rows = trail.links(f'message:{comment["id"]}')
    assert any(row["link_type"] == "sent_to" and row["target_model"] == "agent" and row["target_id"] == worker.id for row in rows)
    trail.command('template make "Read the plan" --brief "Find mistakes" --applies-to plan --purpose critique')
    templates = trail.person("templates.templates", "template", "list")["rows"]
    template_id = next(row["id"] for row in templates if row["title"] == "Read the plan")
    trail.command("plan ready 1")
    trail.person("messages.chat", "template", "send", str(template_id), "--on=plan:1", "--set=agents=2 agents", "--set=size=a normal read")
    trail.command('report make "Plan review" --abstract "Reviewed" --body "Looks correct" --about plan:1')
    trail.story.run_listeners()
    assert "state: ready" in trail.command("plan show 1").output_text


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
def test_existing_prose_fields_keep_their_mentions(trail, command, source):
    trail.command(command)
    trail.story.run_listeners()
    trail.expect_link(source, "doc:1", "mentions")


def test_new_person_message_text_is_scanned(trail):
    trail.person("messages.chat", "message", "send", "Read doc 1")
    trail.story.run_listeners()
    assert any(row["target_model"] == "doc" and row["target_id"] == 1 and row["link_type"] == "mentions" for row in trail.links("message:3"))
