import shutil
from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from core.base.command.context import Context
from engine.check.periodic_checks import PeriodicChecks
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.testing.story import Story
from suites.coding.modules.checks.models.check import Check
from tests.stories.core.modules.library.support.copy_stories import connected, shared_server
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder", "shared_server"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

COMMAND_CHANGED = "The command of this check changed."


def check_fields(title: str, command: str = "echo old", brief: str = "Says old", interval_minutes: int = 1) -> dict[str, object]:
    return {"title": title, "command": command, "brief": brief, "interval_minutes": interval_minutes}


def library_check(server: SharedServerBinary, token: str, **fields: object) -> int:
    return int(str(server.send(token, "POST", "/items/check", {"fields": fields})[1]["id"]))


def change_check(server: SharedServerBinary, token: str, item_id: int, version: int, **fields: object) -> None:
    code = server.send(token, "PUT", f"/items/check/{item_id}", {"fields": fields}, {"If-Match": f'"{version}"'})[0]
    assert code == 200


def story_with_check(new_story, server: SharedServerBinary, tokens, title: str, **changes: object) -> tuple[Story, int]:
    item_id = library_check(server, tokens.admin, **{**check_fields(title), **changes})
    story = connected(new_story, server, tokens.editor)
    story.expect_text(f"library get check {item_id} --read", f"library check {item_id}, version 1 is now check 1", actor=story.user)
    return story, item_id


def copy_state(story: Story, item_id: int) -> CopyState:
    return story.container.get(Queries).query(LibraryCopy).filter(share="check", item_id=item_id).first().state


def test_getting_a_check_shows_its_command_first_and_needs_a_person_to_read_it(new_story, shared_server):
    server, tokens = shared_server
    item_id = library_check(server, tokens.admin, **check_fields("Needs reading", "echo careful"))
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal(f"library get check {item_id}", "this check runs on your computer: echo careful", actor=story.user)
    story.expect_rows(story.container.get(Queries).query(Check).count() == 0)


def test_a_check_arrives_stopped_and_never_runs_until_a_person_starts_it(new_story, shared_server):
    server, tokens = shared_server
    story, item_id = story_with_check(new_story, server, tokens, "Arrives stopped", command="true")
    story.expect_rows(story.row(Check, 1).stopped, story.row(Check, 1).command == "true", story.row(Check, 1).interval_minutes == 1)
    story.advance(timedelta(minutes=5))
    story.container.get(PeriodicChecks).run()
    story.expect_rows(story.row(Check, 1).last_run_at is None)
    story.expect_refusal("check run 1", "check 1 is stopped", actor=story.user)
    story.expect_text("check start 1", "check 1 started", actor=story.user)
    story.container.get(PeriodicChecks).run()
    story.expect_rows(story.row(Check, 1).last_passed is True)


def test_a_changed_command_of_a_started_check_waits_and_the_old_command_goes_on_running(new_story, shared_server):
    server, tokens = shared_server
    story, item_id = story_with_check(new_story, server, tokens, "Started and changed")
    story.expect_text("check start 1", "check 1 started", actor=story.user)
    change_check(server, tokens.admin, item_id, 1, **check_fields("Started and changed", "echo new", "Says new", 1))
    story.expect_text("library sync", "1 copies followed, 1 changed.", actor=story.agent)
    waiting = story.container.get(Queries).query(LibraryCopy).filter(share="check").first()
    story.expect_rows(waiting.state is CopyState.REVIEW, waiting.note == COMMAND_CHANGED, story.row(Check, 1).command == "echo old", story.row(Check, 1).brief == "Says old")
    story.expect_text("check run 1", "check 1 passed", actor=story.user)
    story.expect_rows("old" in story.row(Check, 1).last_output)
    story.expect_text("library copies", "Status: New version to read", COMMAND_CHANGED, actor=story.agent)


def test_a_stopped_check_takes_a_changed_command(new_story, shared_server):
    server, tokens = shared_server
    story, item_id = story_with_check(new_story, server, tokens, "Stopped and changed")
    change_check(server, tokens.admin, item_id, 1, **check_fields("Stopped and changed", "echo new", "Says new", 1))
    story.expect_text("library sync", "1 copies followed, 1 changed.", actor=story.agent)
    story.expect_rows(story.row(Check, 1).command == "echo new", story.row(Check, 1).stopped, copy_state(story, item_id) is CopyState.SYNCED)


def test_a_check_removed_from_this_journal_leaves_and_the_item_stays_in_the_library(new_story, shared_server):
    server, tokens = shared_server
    story, item_id = story_with_check(new_story, server, tokens, "Removed here")
    story.expect_text("check remove 1", "check 1", actor=story.user)
    story.expect_text("library sync", "Reached the library", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(LibraryCopy).filter(share="check", item_id=item_id).first() is None,
                      server.send(tokens.admin, "GET", f"/items/check/{item_id}")[1]["version"] == 1)


def test_a_hidden_check_cannot_be_shared(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    saving = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    story.container.get(Repository).save(Check(creator_id=story.user.id, title="Not shareable", command="true", hidden=True), saving)
    story.expect_refusal("library share check 1", "check 1 cannot be shared: this check belongs to a task's wait", actor=story.user)


def test_the_check_of_a_task_wait_cannot_be_shared(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.run('task make "Cart" --environment main')
    story.expect_success("task block 1 --until 'false' --every 2", "state: blocked")
    waiting = story.container.get(Queries).query(Check).first()
    story.expect_rows(waiting.task_wait_id is not None)
    story.expect_refusal(f"library share check {waiting.id}", f"check {waiting.id} cannot be shared: this check belongs to a task's wait", actor=story.user)
