import json

import pytest

from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from tests.stories.core.support.coding_fixtures import BuilderStarted

ALL_FORMS = "guard listen commit"


@pytest.fixture
def author(new_story):
    return new_story(fixture=BuilderStarted)


def key_rows(story) -> list[dict[str, object]]:
    outcome = story.run("event keys --json", actor=story.agent)
    assert outcome.code == 0, outcome.output_text
    return json.loads(outcome.output_text)["rows"]


def test_s1_each_line_holds_the_key_the_forms_and_the_log_name_sorted_by_key(author):
    author.expect_success("event keys --grep worktree", f"suites.coding.workers.worker_worktree.cut   {ALL_FORMS}   worker_worktree.cut   a worker worktree was cut", actor=author.agent)
    lines = author.run("event keys", actor=author.agent).output_text.splitlines()
    author.expect_rows(lines == sorted(lines), "core.drivers.hook_call.compact   commit   hook_call.compact   a hook call was compacted" in lines)
    author.expect_text("event keys --grep no-such-key", "no event has that key", actor=author.agent)


def test_s1_a_model_with_a_lifecycle_lists_each_move(author):
    keys = {row["key"] for row in key_rows(author)}
    missing = [move.name for move in TaskLifecycle.moves() if f"core.tasks.task.{move.name}" not in keys]
    author.expect_rows(not missing, "core.tasks.task.created" in keys, "core.tasks.task.updated" in keys, "core.tasks.task.deleted" in keys)
