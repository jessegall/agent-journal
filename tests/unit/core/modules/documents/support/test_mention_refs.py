import pytest

from core.modules.documents.support.mention_refs import MentionRefs


@pytest.mark.parametrize("text", ["TASK:12", "task 12", "task\n12", "task 12.", "(task 12)"])
def test_existing_reference_forms_are_preserved(text):
    assert MentionRefs.found(text, ["task"]) == tuple([("task", 12)])


def test_document_alias_and_duplicates_keep_first_order():
    assert MentionRefs.found("document 3; task 12; DOC:3; task 12", ("doc", "task")) == (("doc", 3), ("task", 12))


@pytest.mark.parametrize("text", ["task 12.5", "task 12-34", "other-task 12"], ids=["decimal", "range", "embedded-command"])
def test_malformed_reference_tokens_are_ignored(text):
    assert MentionRefs.found(f"{text}; plan 7", ("task", "plan")) == tuple([("plan", 7)])


@pytest.mark.parametrize("number", ["0", "9223372036854775808", "9" * 5000], ids=["zero", "above-sqlite-id", "long-digit-run"])
def test_reference_numbers_outside_id_range_are_ignored(number):
    assert MentionRefs.found(f"task {number}; plan 7", ("task", "plan")) == tuple([("plan", 7)])


def test_largest_stored_id_and_registered_hyphenated_command_are_valid():
    assert MentionRefs.found("task-log:9223372036854775807", ["task-log"]) == tuple([("task-log", 9223372036854775807)])
