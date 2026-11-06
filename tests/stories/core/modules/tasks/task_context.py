import json
import pytest
import sqlite3
from unittest.mock import patch
from datetime import timedelta

from core.base.database.database import Database
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.database.statement import Statement
from core.base.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_read import TaskRead
from core.modules.tasks.models.task_log import TaskLog
from core.modules.messages.models.message import Message
from core.base.query.query import Query
from core.modules.documents.conditions.work_context_messages import WorkContextSeeds
from core.modules.documents.support.work_context_page import WorkContextRequest
from core.modules.documents.support.work_context_reader import WorkContextReader

from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from tests.stories.core.modules.documents.support.trail_fixtures import feature, linked_trail, LinkedTrail, Trail


class TaskWithoutSource(StoryFixture):
    parent = LinkedTrail

    def steps(self, story):
        trail = Trail(story)
        edge = next(row for row in trail.links("message:2") if row["link_type"] == "about")
        trail.requested_command(f'link remove {edge["id"]}')


class ContextTaskStarted(StoryFixture):
    parent = LinkedTrail

    def steps(self, story):
        story.container.get(TaskBriefRequirement).is_required = True
        Trail(story).command("task start 1")


@pytest.fixture
def started_context(new_story):
    return Trail(new_story(fixture=ContextTaskStarted))


def test_replies_are_visible_in_both_arrival_orders(linked_trail):
    linked_trail.person("messages.chat", "message", "reply", "2", "A later reply")
    page = linked_trail.context()
    text = json.dumps(page)
    feature("Original cart request" in text and "Working on task 1" in text and "A later reply" in text, text)


def test_context_has_authors_relations_and_stable_order(linked_trail):
    page = linked_trail.context()
    messages = page["messages"]
    feature([message["id"] for message in messages] == [1, 2, 3], json.dumps(messages))
    feature(all(message["author"] and message["relations"] for message in messages), json.dumps(messages))
    feature(messages == linked_trail.context()["messages"], "context order changed without a write")


def test_context_is_bounded_and_pages_without_duplicates(linked_trail):
    for number in range(12):
        linked_trail.person("viewer.shell", "task", "comment", "1", f"Context comment {number}")
    first = linked_trail.context(flags="--page 1 --page-size 5")
    second = linked_trail.context(flags="--page 2 --page-size 5")
    feature(len(first["messages"]) == 5 and len(second["messages"]) == 5, "context page size was not applied")
    feature(not {row["id"] for row in first["messages"]} & {row["id"] for row in second["messages"]}, "context repeated a message on the next page")
    feature(first["total"] >= 15, json.dumps(first))


def test_one_oversized_request_has_complete_text_continuation(linked_trail):
    text = "x" * 16000 + "end-of-cart-request"
    linked_trail.person("messages.chat", "message", "edit", "1", "--text", text)
    page = linked_trail.context()
    feature(sum(len(message["text"]) for message in page["messages"]) <= 8000, "initial context exceeds its character budget")
    root = next(message for message in page["messages"] if message["id"] == 1)
    feature(bool(root["next_text_offset"]), "initial truncation has no text continuation")
    first = linked_trail.context(flags="--message 1 --text-offset 0")
    feature(len(first["text"]) <= 8000, "one context segment exceeds its character budget")
    second = linked_trail.context(flags=f'--message 1 --text-offset {first["next_text_offset"]}')
    third = linked_trail.context(flags=f'--message 1 --text-offset {second["next_text_offset"]}')
    feature(first["text"] + second["text"] + third["text"] == text, "text continuation lost or repeated request characters")


def test_ancestor_chain_beyond_twenty_has_progressing_continuation(linked_trail):
    source = next(row for row in linked_trail.links("message:2") if row["target_model"] == "task" and row["target_id"] == 1 and row["link_type"] == "about")
    linked_trail.requested_command(f'link remove {source["id"]}')
    for number in range(4, 29):
        linked_trail.person("messages.chat", "message", "reply", str(number - 1), f"Ancestor {number}")
    linked_trail.command('message reply 28 "Continue task 1"')
    first = linked_trail.context(flags="--page-size 50")
    feature(bool(first["ancestor_cursor"]), "deep chain has no continuing frontier")
    second = linked_trail.context(flags=f'--ancestor-cursor {first["ancestor_cursor"]} --page-size 50')
    feature({row["id"] for row in second["messages"]} - {row["id"] for row in first["messages"]} != set(), "ancestor continuation restarted the same segment")
    first_ids = {row["id"] for row in first["messages"]}
    second_ids = {row["id"] for row in second["messages"]}
    assert not first_ids & second_ids
    assert first_ids | second_ids == set(range(1, 30))
    assert second["ancestor_cursor"] is None
    linked_trail.make_task("Another authorized task")
    refused = linked_trail.story.run(f'task context 2 --ancestor-cursor {first["ancestor_cursor"]} --json', actor=linked_trail.story.agent)
    feature(refused.code == 1, "an ancestor cursor escaped its original task")


def test_context_continuations_do_not_change_work_source(linked_trail):
    linked_trail.switch(2)
    linked_trail.context(flags="--message 1 --text-offset 0")
    linked_trail.make_task()
    linked_trail.expect_link("message:2", "task:2", "about")
    linked_trail.expect_no_link("message:1", "task:2")


def test_overview_includes_source_comment_and_original_message(linked_trail):
    before = linked_trail.source_rows(linked_trail.story.agent.id)
    outcome = linked_trail.command("task overview 1")
    feature("Original cart request" in outcome.output_text and "Implement the cart request" in outcome.output_text, outcome.output_text)
    feature(before == linked_trail.source_rows(linked_trail.story.agent.id), "overview changed the selected source")


def test_overview_bounded_queries_keep_source_and_counts(linked_trail):
    for number in range(12):
        linked_trail.command(f'task log 1 "Cart log {number}"')
        linked_trail.person("viewer.shell", "task", "comment", "1", f"Cart comment {number}")
    outcome = linked_trail.command("task overview 1")
    feature("Original cart request" in outcome.output_text, outcome.output_text)
    feature("Cart log 0" not in outcome.output_text and "Cart log 11" in outcome.output_text, outcome.output_text)
    feature("context 1" in outcome.output_text and "--page" in outcome.output_text, outcome.output_text)


def test_start_return_and_compaction_require_the_same_context(started_context):
    linked_trail = started_context
    linked_trail.story.container.get(TaskBriefRequirement).is_required = True
    first = linked_trail.command("task overview 1")
    linked_trail.make_task("Interrupting cart work")
    linked_trail.story.advance(timedelta(seconds=1))
    linked_trail.command("task start 2")
    linked_trail.command("task overview 2")
    linked_trail.story.hook("s-1", HookSamples.sample("compact"))
    linked_trail.story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "journal task overview 2")
    linked_trail.command("task overview 2")
    linked_trail.command('task close 2 --outcome "Interrupting work is complete"')
    linked_trail.story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "journal task overview 1")
    second = linked_trail.command("task overview 1")
    feature("Original cart request" in first.output_text and "Original cart request" in second.output_text, second.output_text)
    linked_trail.story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_context_cycles_and_missing_ends_do_not_hold_the_agent(linked_trail):
    linked_trail.person("messages.chat", "message", "delete", "1")
    linked_trail.story.container.get(TaskBriefRequirement).is_required = True
    linked_trail.command("task start 1")
    outcome = linked_trail.command("task overview 1")
    feature("Implement the cart request" in outcome.output_text, outcome.output_text)
    linked_trail.story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_plan_comments_and_report_references_reach_task_overview(linked_trail):
    linked_trail.command('phase make --plan 1 "Context phase"')
    linked_trail.command("phase place 1 --phase 1")
    linked_trail.person("viewer.shell", "plan", "comment", "1", "Keep the plan approval details")
    linked_trail.command('report make "Plan findings" --abstract "Findings" --body "A long report body" --about plan:1')
    linked_trail.command('doc make "Overview design" --abstract "Cart scope" --body "A long design body"')
    linked_trail.command('plan edit 1 --document-id 2')
    linked_trail.make_task("Check the approved cart behavior")
    linked_trail.command('phase place 2 --phase 1')
    linked_trail.command('plan ready 1')
    linked_trail.person("messages.chat", "plan", "approve", "1", "--message=Approved cart scope")
    outcome = linked_trail.command("task overview 1")
    feature("Keep the plan approval details" in outcome.output_text and "Plan findings" in outcome.output_text, outcome.output_text)
    feature("A long report body" not in outcome.output_text, "overview expanded a report instead of naming it")
    feature("Overview design" in outcome.output_text and "Plan approval" in outcome.output_text, outcome.output_text)
    feature("A long design body" not in outcome.output_text, "overview expanded the design body")


def test_text_continuation_cannot_open_an_unrelated_message(linked_trail):
    other = linked_trail.person("messages.chat", "message", "send", "Private unrelated text segment")
    result = linked_trail.story.run(f'task context 1 --message {other["id"]} --text-offset 0 --json', actor=linked_trail.story.agent)
    feature(result.code == 1 and "Private unrelated text segment" not in result.output_text, result.output_text)


def test_context_loads_only_a_bounded_message_page(linked_trail):
    for number in range(40):
        linked_trail.person("viewer.shell", "task", "comment", "1", f"Bounded comment {number}")
    database = linked_trail.story.container.get(Database)
    before = database.tally.points()
    page = linked_trail.context()
    after = database.tally.points()
    assert len(page["messages"]) == 5
    assert after.tables["messages"] - before.tables["messages"] <= 10
    assert sum(len(row["text"]) for row in page["messages"]) <= 8000


def test_context_page_size_is_clamped(linked_trail):
    for number in range(55):
        linked_trail.person("viewer.shell", "task", "comment", "1", f"Clamped comment {number}")
    page = linked_trail.context(flags="--page-size 1000")
    assert len(page["messages"]) == 50 and page["page_size"] == 50


@pytest.mark.parametrize("flags", ["--ancestor-cursor broken", "--text-offset -1 --message 1", "--page 0", "--page-size 0", "--page 99999999999999999999999999"])
def test_invalid_context_continuations_are_refused(linked_trail, flags):
    answer = linked_trail.story.run(f"task context 1 {flags} --json", actor=linked_trail.story.agent)
    assert answer.code == 1


def test_all_context_pages_recover_each_message_once(linked_trail):
    for number in range(11):
        linked_trail.person("viewer.shell", "task", "comment", "1", f"Recoverable comment {number}")
    first = linked_trail.context()
    seen = [row["id"] for row in first["messages"]]
    for number in range(2, 1 + (first["total"] + 4) // 5):
        seen.extend(row["id"] for row in linked_trail.context(flags=f"--page {number}")["messages"])
    assert len(seen) == len(set(seen)) == first["total"]


def test_oversized_text_is_projected_before_loading(linked_trail):
    linked_trail.person("messages.chat", "message", "edit", "1", "--text", "Large " * 30000)
    database = linked_trail.story.container.get(Database)
    before = database.tally.points()
    segment = linked_trail.context(flags="--message 1 --text-offset 8000")
    after = database.tally.points()
    assert len(segment["text"]) <= 8000 and segment["next_text_offset"] == 16000
    assert after.bytes - before.bytes < 50000


def test_a_late_source_request_is_reserved_in_the_initial_page(new_story):
    linked_trail = Trail(new_story(fixture=TaskWithoutSource))
    for number in range(8):
        linked_trail.person("viewer.shell", "task", "comment", "1", f"Earlier comment {number}")
    source = linked_trail.person("messages.chat", "message", "send", "The late source request")
    linked_trail.command(f'message reply {source["id"]} "Continue task 1"')
    page = linked_trail.context()
    assert len(page["messages"]) == 5 and source["id"] in {message["id"] for message in page["messages"]}


def test_context_includes_a_reply_written_before_resource_creation(linked_trail):
    request = linked_trail.person("messages.chat", "message", "reply", "1", "Another request for the forthcoming resource")
    linked_trail.command(f'message reply {request["id"]} "Will create task 2"')
    linked_trail.make_task("Created after the reply")
    page = linked_trail.context(number=2)
    assert "Will create task 2" in json.dumps(page) and "Original cart request" in json.dumps(page)


def test_another_agents_private_branch_does_not_enter_context(linked_trail):
    other = linked_trail.story.new_row_id("agent start private-context-main claude main --environment main")
    private = linked_trail.person("messages.chat", "message", "send", "Private branch for another agent", "--target-agent", str(other))
    linked_trail.story.expect_success(f'message edit {private["id"]} --parent-id 1', actor=Actor(other, ActorType.AGENT))
    linked_trail.story.expect_success(f'message reply {private["id"]} "Private branch response"', actor=Actor(other, ActorType.AGENT))
    page = linked_trail.context(flags="--page-size 50")
    assert "Private branch" not in json.dumps(page)
    result = linked_trail.story.run(f'task context 1 --message {private["id"]} --text-offset 0 --json', actor=linked_trail.story.agent)
    assert result.code == 1 and "Private branch" not in result.output_text


def test_database_errors_are_not_replaced_by_empty_context(linked_trail):
    story = linked_trail.story
    with story.container.get(Scopes).read_scope((), story.agent.id, 1):
        row = story.container.get(Queries).query(Task).find(1)
        with patch.object(WorkContextSeeds, "statement", return_value=Statement("SELECT missing_context_column FROM messages")):
            with pytest.raises(sqlite3.OperationalError, match="missing_context_column"):
                story.container.get(WorkContextReader).read(row, Caller(story.agent, 1), WorkContextRequest())


def test_overview_failure_does_not_record_a_read_or_release_the_gate(started_context):
    linked_trail = started_context
    story = linked_trail.story
    story.container.get(TaskBriefRequirement).is_required = True
    with patch.object(WorkContextSeeds, "statement", return_value=Statement("SELECT missing_context_column FROM messages")):
        outcome = story.run("task overview 1", actor=story.agent)
    feature(outcome.code != 0 and "missing_context_column" in outcome.output_text, outcome.output_text)
    with story.container.get(Scopes).read_scope((), story.agent.id, 1):
        feature(not story.container.get(Queries).query(TaskRead).filter(task_id=1, session_agent_id=story.agent.id).exists(), "failed overview recorded TaskRead")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "journal task overview 1")
    linked_trail.command("task overview 1")
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_overview_never_loads_unbounded_messages_or_logs(linked_trail):
    original = Query.all_rows

    def bounded(query):
        feature(query.model not in (Message, TaskLog), "overview loaded all messages or logs")
        return original(query)

    with patch.object(Query, "all_rows", bounded):
        outcome = linked_trail.command("task overview 1")
    feature("Original cart request" in outcome.output_text, outcome.output_text)
