import json
from datetime import timedelta

from core.testing.hook_samples import HookSamples
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from tests.stories.core.modules.documents.support.trail_fixtures import feature, linked_trail, pending


@pending(6849)
def test_replies_are_visible_in_both_arrival_orders(linked_trail):
    linked_trail.person("messages.chat", "message", "reply", "2", "A later reply")
    page = linked_trail.context()
    text = json.dumps(page)
    feature("Original cart request" in text and "Working on task 1" in text and "A later reply" in text, text)


@pending(6849)
def test_context_has_authors_relations_and_stable_order(linked_trail):
    page = linked_trail.context()
    messages = page["messages"]
    feature([message["id"] for message in messages] == [1, 2, 3], json.dumps(messages))
    feature(all(message["author"] and message["relations"] for message in messages), json.dumps(messages))
    feature(messages == linked_trail.context()["messages"], "context order changed without a write")


@pending(6849)
def test_context_is_bounded_and_pages_without_duplicates(linked_trail):
    for number in range(12):
        linked_trail.person("viewer.shell", "task", "comment", "1", f"Context comment {number}")
    first = linked_trail.context(flags="--page 1 --page-size 5")
    second = linked_trail.context(flags="--page 2 --page-size 5")
    feature(len(first["messages"]) == 5 and len(second["messages"]) == 5, "context page size was not applied")
    feature(not {row["id"] for row in first["messages"]} & {row["id"] for row in second["messages"]}, "context repeated a message on the next page")
    feature(first["total"] >= 15, json.dumps(first))


@pending(6849)
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


@pending(6849)
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
    linked_trail.make_task("Another authorized task")
    refused = linked_trail.story.run(f'task context 2 --ancestor-cursor {first["ancestor_cursor"]} --json', actor=linked_trail.story.agent)
    feature(refused.code == 1, "an ancestor cursor escaped its original task")


@pending(6849)
def test_context_continuations_do_not_change_work_source(linked_trail):
    linked_trail.switch(2)
    linked_trail.context(flags="--message 1 --text-offset 0")
    linked_trail.make_task()
    linked_trail.expect_link("message:2", "task:2", "about")
    linked_trail.expect_no_link("message:1", "task:2")


@pending(6890)
def test_overview_includes_source_comment_and_original_message(linked_trail):
    outcome = linked_trail.command("task overview 1")
    feature("Original cart request" in outcome.output_text and "Implement the cart request" in outcome.output_text, outcome.output_text)


@pending(6890)
def test_overview_bounded_queries_keep_source_and_counts(linked_trail):
    for number in range(12):
        linked_trail.command(f'task log 1 "Cart log {number}"')
        linked_trail.person("viewer.shell", "task", "comment", "1", f"Cart comment {number}")
    outcome = linked_trail.command("task overview 1")
    feature("Original cart request" in outcome.output_text, outcome.output_text)
    feature("Cart log 0" not in outcome.output_text and "Cart log 11" in outcome.output_text, outcome.output_text)
    feature("context 1" in outcome.output_text and "--page" in outcome.output_text, outcome.output_text)


@pending(6890)
def test_start_return_and_compaction_require_the_same_context(linked_trail):
    linked_trail.story.container.get(TaskBriefRequirement).is_required = True
    linked_trail.command("task start 1")
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


@pending(6890)
def test_context_cycles_and_missing_ends_do_not_hold_the_agent(linked_trail):
    linked_trail.person("messages.chat", "message", "delete", "1")
    linked_trail.story.container.get(TaskBriefRequirement).is_required = True
    linked_trail.command("task start 1")
    outcome = linked_trail.command("task overview 1")
    feature("Implement the cart request" in outcome.output_text, outcome.output_text)
    linked_trail.story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


@pending(6890)
def test_plan_comments_and_report_references_reach_task_overview(linked_trail):
    linked_trail.command('phase make --plan 1 "Context phase"')
    linked_trail.command("phase place 1 --phase 1")
    linked_trail.person("viewer.shell", "plan", "comment", "1", "Keep the plan approval details")
    linked_trail.command('report make "Plan findings" --abstract "Findings" --body "A long report body" --about plan:1')
    outcome = linked_trail.command("task overview 1")
    feature("Keep the plan approval details" in outcome.output_text and "Plan findings" in outcome.output_text, outcome.output_text)
    feature("A long report body" not in outcome.output_text, "overview expanded a report instead of naming it")


@pending(6849)
def test_text_continuation_cannot_open_an_unrelated_message(linked_trail):
    other = linked_trail.person("messages.chat", "message", "send", "Private unrelated text segment")
    result = linked_trail.story.run(f'task context 1 --message {other["id"]} --text-offset 0 --json', actor=linked_trail.story.agent)
    feature(result.code == 1 and "Private unrelated text segment" not in result.output_text, result.output_text)
