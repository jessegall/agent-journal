import json
import shutil
from datetime import timedelta

import pytest

from core.modules.documents.models.doc import Doc
from suites.coding.modules.checks.models.check import Check
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.library_client import LibraryClient
from core.modules.library.support.library_failures import LibraryFailures
from core.modules.library.errors.library_item_removed_error import LibraryItemRemovedError
from core.modules.library.errors.library_unreachable_error import LibraryUnreachableError
from engine.testing.stories.story import Story
from tests.stories.core.modules.library.support.copy_stories import (server_change, connected, copy_line, item_copy, copy_with, made_copy, shared_server)
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder", "shared_server"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

ERROR_BODY = json.dumps({"error": "it failed", "hint": "try this"}).encode()
COMMAND_CHANGED = "The command of this check changed."
CHANGED_SINGLE = "Reached the library. 1 copies followed, 1 changed."
CHANGED_NONE = "Reached the library. 1 copies followed, 0 changed."


def edit_body(story: Story, copy: LibraryCopy, body: str) -> None:
    story.expect_success(f'doc edit {copy.row_id} --body "{body}"', actor=story.user)


def server_item(server: SharedServerBinary, token: str, copy: LibraryCopy) -> dict[str, object]:
    return server.send(token, "GET", f"/items/doc/{copy.item_id}")[1]


def stored_copy(story: Story, copy: LibraryCopy) -> LibraryCopy:
    return story.row(LibraryCopy, copy.id)


def counted(monkeypatch, client: LibraryClient, method: str) -> list[tuple[object, ...]]:
    calls: list[tuple[object, ...]] = []
    real = getattr(client, method)

    def counting_call(*arguments: object) -> object:
        calls.append(arguments)
        return real(*arguments)

    monkeypatch.setattr(client, method, counting_call)
    return calls


def failing_update(monkeypatch, client: LibraryClient, failure: Exception, item_id: int | None = None) -> list[tuple[object, ...]]:
    calls: list[tuple[object, ...]] = []
    real = client.update

    def failing(*arguments: object) -> object:
        calls.append(arguments)
        if item_id is not None and arguments[1] != item_id:
            return real(*arguments)
        raise failure

    monkeypatch.setattr(client, "update", failing)
    return calls




























def test_a_new_server_version_that_must_be_read_first_waits_for_a_person(new_story, shared_server):
    server, tokens = shared_server
    fields = {"title": "Granite review", "command": "echo hello", "brief": "Says hello", "interval_minutes": 5}
    item = server.send(tokens.admin, "POST", "/items/check", {"fields": fields})[1]
    story = connected(new_story, server, tokens.editor)
    story.expect_text(f"library get check {item['id']} --read", "is now check 1", actor=story.user)
    story.expect_text("check start 1", "check 1 started", actor=story.user)
    server.send(tokens.admin, "PUT", f"/items/check/{item['id']}", {"fields": {**fields, "command": "echo changed"}}, {"If-Match": '"1"'})
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    copy = story.first_row(LibraryCopy, share="check")
    story.expect_rows(copy.state is CopyState.REVIEW, copy.note == COMMAND_CHANGED, story.row(Check, 1).command == "echo hello", copy.server_version == 2)
    story.expect_text("library copies", "Status: New version to read", COMMAND_CHANGED, actor=story.agent)


def conflicted_copy(story: Story, server: SharedServerBinary, tokens, title: str) -> LibraryCopy:
    copy = made_copy(story, server, tokens.admin, title)
    edit_body(story, copy, "Edited here.")
    server_change(server, tokens.admin, copy.item_id, title, "Admin text.", 1)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    assert stored_copy(story, copy).state is CopyState.CONFLICT
    return copy




def test_keeping_the_library_version_keeps_the_text_in_the_revisions_even_after_a_fresh_edit(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = conflicted_copy(story, server, tokens, "Slate keep library")
    edit_body(story, copy, "Edited again.")
    story.expect_success(f"library resolve {copy.id} --keep library", f"doc {copy.row_id} follows library doc {copy.item_id}, version 2. Status: In sync", actor=story.user)
    story.expect_rows(story.row(Doc, copy.row_id).body == "Admin text.", stored_copy(story, copy).state is CopyState.SYNCED, stored_copy(story, copy).base_version == 2)
    story.expect_text(f"doc revision {copy.row_id} 2", "Edited here.", actor=story.user)
    story.expect_text(f"doc revision {copy.row_id} 3", "Edited again.", actor=story.user)
    story.expect_text(f"doc revision {copy.row_id} 4", "Admin text.", actor=story.user)


def test_a_copy_that_is_in_step_has_nothing_to_resolve(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Garnet nothing to resolve")
    story.expect_refusal(f"library resolve {copy.id} --keep mine", f"doc {copy.row_id} has nothing to resolve: it is synced", actor=story.user)




def command_review(new_story, server: SharedServerBinary, tokens, title: str) -> tuple[Story, LibraryCopy]:
    fields = {"title": title, "command": "echo hello", "brief": "Says hello", "interval_minutes": 5}
    item = server.send(tokens.admin, "POST", "/items/check", {"fields": fields})[1]
    story = connected(new_story, server, tokens.editor)
    story.expect_text(f"library get check {item['id']} --read", "is now check 1", actor=story.user)
    story.expect_text("check start 1", "check 1 started", actor=story.user)
    server.send(tokens.admin, "PUT", f"/items/check/{item['id']}", {"fields": {**fields, "command": "echo changed"}}, {"If-Match": '"1"'})
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    copy = story.first_row(LibraryCopy, share="check")
    assert copy.state is CopyState.REVIEW
    return story, copy


def test_keeping_mine_ends_a_new_version_to_read_by_sending_the_text_here(new_story, shared_server):
    server, tokens = shared_server
    story, copy = command_review(new_story, server, tokens, "Agate review mine")
    story.expect_text(f"library resolve {copy.id} --keep mine", "Status: In sync", actor=story.user)
    item = server.send(tokens.admin, "GET", f"/items/check/{copy.item_id}")[1]
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, item["version"] == 3, item["fields"]["command"] == "echo hello", story.row(Check, 1).command == "echo hello")
