import json
import shutil
from datetime import timedelta

import pytest

from core.base.query.queries import Queries
from core.modules.documents.models.doc import Doc
from suites.coding.modules.checks.models.check import Check
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.library_client import LibraryClient
from core.modules.library.support.library_failures import LibraryFailures
from core.modules.library.support.library_item_removed_error import LibraryItemRemovedError
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError
from core.testing.story import Story
from tests.stories.core.modules.library.support.copy_stories import (change_on_server, connected, copy_line, copy_of_item, copy_with, made_copy, shared_server)
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


def test_an_edit_with_write_access_is_sent_and_the_copy_is_in_sync_at_the_new_version(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Quartz edit sent")
    edit_body(story, copy, "Edited here.")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    item = server_item(server, tokens.editor, copy)
    story.expect_rows(item["version"] == 2, item["fields"]["body"] == "Edited here.", stored_copy(story, copy).base_version == 2, stored_copy(story, copy).state is CopyState.SYNCED)
    story.expect_rows(copy_line(story, copy).endswith("version 2. Status: In sync"))


def test_an_edit_of_a_removed_item_is_kept_and_not_sent_and_a_restore_makes_it_a_conflict(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Basalt removed edit")
    server.send(tokens.admin, "DELETE", f"/items/doc/{copy.item_id}")
    edit_body(story, copy, "Edited while removed.")
    update_calls = counted(monkeypatch, story.container.get(LibraryClient), "update")
    story.expect_text("library sync", "Reached the library", actor=story.agent)
    story.expect_rows(update_calls == [], stored_copy(story, copy).state is CopyState.REMOVED, story.row(Doc, copy.row_id).body == "Edited while removed.")
    server.send(tokens.admin, "POST", f"/items/doc/{copy.item_id}/restore")
    story.expect_text("library sync", "Reached the library", actor=story.agent)
    story.expect_rows(update_calls == [], stored_copy(story, copy).state is CopyState.CONFLICT, story.row(Doc, copy.row_id).body == "Edited while removed.")


def test_a_read_only_edit_stays_here_and_is_sent_once(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.reader)
    copy = made_copy(story, server, tokens.admin, "Slate read only")
    edit_body(story, copy, "Edited by a reader.")
    update_calls = counted(monkeypatch, story.container.get(LibraryClient), "update")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_text("library sync", CHANGED_NONE, actor=story.agent)
    story.expect_rows(len(update_calls) == 1, stored_copy(story, copy).state is CopyState.DENIED, story.row(Doc, copy.row_id).body == "Edited by a reader.")
    story.expect_rows(server_item(server, tokens.admin, copy)["version"] == 1, copy_line(story, copy).endswith("Status: Local change, not sent"))


def test_a_newer_server_version_does_not_overwrite_a_read_only_edit_and_is_asked_for_once(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.reader)
    copy = made_copy(story, server, tokens.admin, "Opal read only newer")
    edit_body(story, copy, "Edited by a reader.")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    change_on_server(server, tokens.admin, copy.item_id, "Opal read only newer", "Admin text.", 1)
    fetched = counted(monkeypatch, story.container.get(LibraryClient), "item")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_text("library sync", CHANGED_NONE, actor=story.agent)
    kept = stored_copy(story, copy)
    story.expect_rows(len(fetched) == 1, kept.state is CopyState.DENIED, kept.server_version == 2, "Admin text." in kept.server_fields, story.row(Doc, copy.row_id).body == "Edited by a reader.")


def test_a_role_raised_to_edit_sends_the_waiting_edit(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, server.new_user("Mia", "read"))
    copy = made_copy(story, server, tokens.admin, "Jasper role raised")
    edit_body(story, copy, "Edited by Mia.")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.DENIED)
    server.run("user role Mia edit")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, server_item(server, tokens.admin, copy)["fields"]["body"] == "Edited by Mia.")


def test_a_role_raised_to_edit_compares_a_waiting_edit_with_a_newer_server_version(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, server.new_user("Noor", "read"))
    copy = made_copy(story, server, tokens.admin, "Garnet role raised newer")
    edit_body(story, copy, "Edited by Noor.")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    change_on_server(server, tokens.admin, copy.item_id, "Garnet role raised newer", "Admin text.", 1)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    server.run("user role Noor edit")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.CONFLICT, story.row(Doc, copy.row_id).body == "Edited by Noor.")


def test_a_stale_write_is_a_conflict_that_keeps_both_versions(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Pearl stale write")
    edit_body(story, copy, "Edited here.")
    client = story.container.get(LibraryClient)
    real_update = client.update

    def update_after_admin(*arguments: object) -> object:
        change_on_server(server, tokens.admin, copy.item_id, "Pearl stale write", "Admin text.", 1)
        return real_update(*arguments)

    monkeypatch.setattr(client, "update", update_after_admin)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    kept = stored_copy(story, copy)
    story.expect_rows(kept.state is CopyState.CONFLICT, kept.server_version == 2, "Admin text." in kept.server_fields, story.row(Doc, copy.row_id).body == "Edited here.")
    story.expect_rows(server_item(server, tokens.admin, copy)["fields"]["body"] == "Admin text.", copy_line(story, copy).endswith("Status: Conflict"))


def test_a_change_on_both_sides_is_a_conflict_that_overwrites_nothing(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Amber both sides")
    edit_body(story, copy, "Edited here.")
    change_on_server(server, tokens.admin, copy.item_id, "Amber both sides", "Admin text.", 1)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.CONFLICT, story.row(Doc, copy.row_id).body == "Edited here.",
                      server_item(server, tokens.admin, copy)["fields"]["body"] == "Admin text.")


def test_a_conflict_sends_no_more_requests_for_its_item(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Topaz quiet conflict")
    edit_body(story, copy, "Edited here.")
    change_on_server(server, tokens.admin, copy.item_id, "Topaz quiet conflict", "Admin text.", 1)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    client = story.container.get(LibraryClient)
    fetched, update_calls = counted(monkeypatch, client, "item"), counted(monkeypatch, client, "update")
    story.expect_text("library sync", CHANGED_NONE, actor=story.agent)
    story.expect_rows(fetched == [], update_calls == [])


def test_the_same_text_on_both_sides_is_no_conflict(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Agate same text")
    edit_body(story, copy, "Same words.")
    change_on_server(server, tokens.admin, copy.item_id, "Agate same text", "Same words.", 1)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, stored_copy(story, copy).base_version == 2, copy_line(story, copy).endswith("Status: In sync"))


def test_a_person_who_undoes_an_edit_finds_the_copy_in_sync(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.reader)
    copy = made_copy(story, server, tokens.admin, "Onyx undone")
    edit_body(story, copy, "Edited by a reader.")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.DENIED)
    edit_body(story, copy, "Tag first.")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    kept = stored_copy(story, copy)
    story.expect_rows(kept.state is CopyState.SYNCED, kept.unsent_digest == "", copy_line(story, copy).endswith("Status: In sync"))


def test_a_lost_response_is_settled_by_the_next_round_without_a_conflict(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Marble lost response")
    edit_body(story, copy, "Edited here.")
    client = story.container.get(LibraryClient)
    real_update = client.update

    def update_without_answer(*arguments: object) -> object:
        real_update(*arguments)
        raise LibraryUnreachableError("The server did not answer.")

    monkeypatch.setattr(client, "update", update_without_answer)
    story.expect_text("library sync", "Did not reach the library. The server did not answer.", actor=story.agent)
    monkeypatch.setattr(client, "update", real_update)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, stored_copy(story, copy).base_version == 2, server_item(server, tokens.admin, copy)["version"] == 2)


def test_a_refused_text_is_noted_on_its_copy_and_leaves_every_other_copy_settled(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    rejected_copy = made_copy(story, server, tokens.admin, "Slate refused")
    changed = made_copy(story, server, tokens.admin, "Slate changed")
    unedited_copy = made_copy(story, server, tokens.admin, "Slate quiet")
    edit_body(story, rejected_copy, "Too long for the server.")
    edit_body(story, changed, "Edited here.")
    failing_update(monkeypatch, story.container.get(LibraryClient), LibraryFailures.classify(413, ERROR_BODY), rejected_copy.item_id)
    story.expect_text("library sync", "Reached the library. 3 copies followed, 2 changed.", actor=story.agent)
    story.expect_rows(stored_copy(story, rejected_copy).state is CopyState.REJECTED, stored_copy(story, rejected_copy).note == "it failed", stored_copy(story, changed).state is CopyState.SYNCED,
                      stored_copy(story, changed).base_version == 2, stored_copy(story, unedited_copy).base_version == 1)
    story.expect_text("library copies", "Status: Not accepted by the server", "it failed", actor=story.agent)


@pytest.mark.parametrize("status", [400, 413, 428])
def test_a_refused_text_is_not_sent_again_until_the_text_changes(new_story, shared_server, monkeypatch, status):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, f"Pearl refused {status}")
    edit_body(story, copy, "Refused text.")
    calls = failing_update(monkeypatch, story.container.get(LibraryClient), LibraryFailures.classify(status, ERROR_BODY))
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_text("library sync", CHANGED_NONE, actor=story.agent)
    story.expect_rows(len(calls) == 1, stored_copy(story, copy).state is CopyState.REJECTED)
    edit_body(story, copy, "Another try.")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(len(calls) == 2, stored_copy(story, copy).state is CopyState.REJECTED)


@pytest.mark.parametrize("reason", ["unauthorized", "server error", "html page"])
def test_a_failure_of_the_server_leaves_every_other_copy_as_it_was_and_the_next_round_settles_them(new_story, shared_server, monkeypatch, reason):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    first = made_copy(story, server, tokens.admin, f"Jasper first {reason}")
    second = made_copy(story, server, tokens.admin, f"Jasper second {reason}")
    unedited_copy = made_copy(story, server, tokens.admin, f"Jasper quiet {reason}")
    edit_body(story, first, "First edit.")
    edit_body(story, second, "Second edit.")
    failure = {"unauthorized": LibraryFailures.classify(401, ERROR_BODY), "server error": LibraryFailures.classify(500, ERROR_BODY),
               "html page": LibraryFailures.classify(200, b"<html>Bad gateway</html>")}[reason]
    client = story.container.get(LibraryClient)
    real_update = client.update
    failing_update(monkeypatch, client, failure, first.item_id)
    story.expect_text("library sync", "Did not reach the library.", actor=story.agent)
    story.expect_rows(all(stored_copy(story, copy).state is CopyState.SYNCED and stored_copy(story, copy).base_version == 1 for copy in (first, second, unedited_copy)),
                      server_item(server, tokens.admin, second)["version"] == 1)
    monkeypatch.setattr(client, "update", real_update)
    connection = story.container.get(Queries).query(LibraryConnection).first()
    if connection.stopped:
        story.expect_rows(connection.stopped == failure.reason)
        story.expect_text("library status", failure.reason, actor=story.agent)
        story.expect_text(f"library connect {server.address} --token {tokens.editor}", "Connected: ", actor=story.user)
    story.expect_text("library sync", "Reached the library. 3 copies followed, 2 changed.", actor=story.agent)
    story.expect_rows(stored_copy(story, first).base_version == 2, stored_copy(story, second).base_version == 2, stored_copy(story, unedited_copy).base_version == 1)


def test_a_restored_backup_is_a_conflict_for_a_person_to_choose(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Quartz backup")
    change_on_server(server, tokens.admin, copy.item_id, "Quartz backup", "Backup text.", 1)
    copy_with(story, copy, base_version=5)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    kept = stored_copy(story, copy)
    story.expect_rows(kept.state is CopyState.CONFLICT, kept.server_version == 2, "Backup text." in kept.server_fields, story.row(Doc, copy.row_id).body == "Tag first.")


def test_a_day_offline_sends_every_change_when_the_network_returns(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    first = made_copy(story, server, tokens.admin, "Basalt offline first")
    second = made_copy(story, server, tokens.admin, "Basalt offline second")
    client = story.container.get(LibraryClient)
    real_state = client.state

    def no_network() -> object:
        raise LibraryUnreachableError("No network.")

    monkeypatch.setattr(client, "state", no_network)
    edit_body(story, first, "Edited offline.")
    story.advance(timedelta(hours=12))
    edit_body(story, second, "Edited later offline.")
    story.expect_text("library sync", "Did not reach the library. No network.", actor=story.agent)
    story.advance(timedelta(hours=12))
    story.expect_rows(copy_line(story, first).endswith("Status: Waiting to send"), copy_line(story, second).endswith("Status: Waiting to send"))
    monkeypatch.setattr(client, "state", real_state)
    story.expect_text("library sync", "Reached the library. 2 copies followed, 2 changed.", actor=story.agent)
    story.expect_rows(server_item(server, tokens.admin, first)["fields"]["body"] == "Edited offline.", server_item(server, tokens.admin, second)["fields"]["body"] == "Edited later offline.",
                      copy_line(story, first).endswith("Status: In sync"), story.container.get(Queries).query(LibraryConnection).first().failure == "")


def test_a_round_cut_off_in_the_middle_is_finished_by_the_next_round_without_sending_twice(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    first_copy = made_copy(story, server, tokens.admin, "Onyx cut done")
    cut = made_copy(story, server, tokens.admin, "Onyx cut off")
    edit_body(story, first_copy, "Edited first.")
    edit_body(story, cut, "Edited second.")
    client = story.container.get(LibraryClient)
    update_calls = counted(monkeypatch, client, "update")
    real_update = client.update

    def update_failing_for_cut_copy(*arguments: object) -> object:
        if arguments[1] == cut.item_id:
            raise LibraryUnreachableError("The connection was cut.")
        return real_update(*arguments)

    monkeypatch.setattr(client, "update", update_failing_for_cut_copy)
    story.expect_text("library sync", "Did not reach the library. The connection was cut.", actor=story.agent)
    story.expect_rows(stored_copy(story, first_copy).base_version == 2, stored_copy(story, cut).base_version == 1)
    monkeypatch.setattr(client, "update", real_update)
    story.expect_text("library sync", "Reached the library. 2 copies followed, 1 changed.", actor=story.agent)
    story.expect_rows(stored_copy(story, cut).base_version == 2, [arguments[1] for arguments in update_calls].count(first_copy.item_id) == 1)


def test_an_item_that_is_gone_when_its_edit_is_sent_changes_nothing(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Slate gone while sending")
    edit_body(story, copy, "Edited here.")
    failing_update(monkeypatch, story.container.get(LibraryClient), LibraryItemRemovedError("gone", ""))
    story.expect_text("library sync", CHANGED_NONE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, stored_copy(story, copy).base_version == 1, story.row(Doc, copy.row_id).body == "Edited here.")


def test_a_new_server_version_that_must_be_read_first_waits_for_a_person(new_story, shared_server):
    server, tokens = shared_server
    fields = {"title": "Granite review", "command": "echo hello", "brief": "Says hello", "interval_minutes": 5}
    item = server.send(tokens.admin, "POST", "/items/check", {"fields": fields})[1]
    story = connected(new_story, server, tokens.editor)
    story.expect_text(f"library get check {item['id']} --read", "is now check 1", actor=story.user)
    story.expect_text("check start 1", "check 1 started", actor=story.user)
    server.send(tokens.admin, "PUT", f"/items/check/{item['id']}", {"fields": {**fields, "command": "echo changed"}}, {"If-Match": '"1"'})
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    copy = story.container.get(Queries).query(LibraryCopy).filter(share="check").first()
    story.expect_rows(copy.state is CopyState.REVIEW, copy.note == COMMAND_CHANGED, story.row(Check, 1).command == "echo hello", copy.server_version == 2)
    story.expect_text("library copies", "Status: New version to read", COMMAND_CHANGED, actor=story.agent)


def conflicted_copy(story: Story, server: SharedServerBinary, tokens, title: str) -> LibraryCopy:
    copy = made_copy(story, server, tokens.admin, title)
    edit_body(story, copy, "Edited here.")
    change_on_server(server, tokens.admin, copy.item_id, title, "Admin text.", 1)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    assert stored_copy(story, copy).state is CopyState.CONFLICT
    return copy


def test_keeping_mine_sends_the_text_with_the_version_the_person_saw_and_ends_the_conflict(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = conflicted_copy(story, server, tokens, "Quartz keep mine")
    story.expect_success(f"library resolve {copy.id} --keep mine", f"doc {copy.row_id} follows library doc {copy.item_id}, version 3. Status: In sync", actor=story.user)
    item = server_item(server, tokens.admin, copy)
    story.expect_rows(item["version"] == 3, item["fields"]["body"] == "Edited here.", stored_copy(story, copy).state is CopyState.SYNCED, story.row(Doc, copy.row_id).body == "Edited here.")


def test_keeping_mine_when_a_third_version_arrived_stays_a_conflict_with_the_newest_text(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = conflicted_copy(story, server, tokens, "Basalt keep mine third")
    client = story.container.get(LibraryClient)
    real_update = client.update

    def update_after_third_version(*arguments: object) -> object:
        change_on_server(server, tokens.admin, copy.item_id, "Basalt keep mine third", "Third text.", 2)
        return real_update(*arguments)

    monkeypatch.setattr(client, "update", update_after_third_version)
    story.expect_text(f"library resolve {copy.id} --keep mine", "Status: Conflict", actor=story.user)
    kept = stored_copy(story, copy)
    story.expect_rows(kept.state is CopyState.CONFLICT, kept.server_version == 3, "Third text." in kept.server_fields, story.row(Doc, copy.row_id).body == "Edited here.")
    story.expect_rows(server_item(server, tokens.admin, copy)["fields"]["body"] == "Third text.")


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


def test_an_agent_cannot_resolve_a_copy(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = conflicted_copy(story, server, tokens, "Opal agent resolve")
    story.expect_refusal(f"library resolve {copy.id} --keep library", "only a person chooses between a copy and its item", actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.CONFLICT)


def test_a_copy_that_is_in_step_has_nothing_to_resolve(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Garnet nothing to resolve")
    story.expect_refusal(f"library resolve {copy.id} --keep mine", f"doc {copy.row_id} has nothing to resolve: it is synced", actor=story.user)


def test_keeping_the_library_version_ends_a_refused_change(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Pearl refused then library")
    edit_body(story, copy, "Refused text.")
    client = story.container.get(LibraryClient)
    real_update = client.update
    failing_update(monkeypatch, client, LibraryFailures.classify(413, ERROR_BODY))
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.REJECTED)
    monkeypatch.setattr(client, "update", real_update)
    story.expect_text(f"library resolve {copy.id} --keep library", "Status: In sync", actor=story.user)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, story.row(Doc, copy.row_id).body == "Tag first.", stored_copy(story, copy).note == "")


def test_keeping_mine_for_a_refused_change_sends_it_again_and_a_reader_stays_refused(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.reader)
    copy = made_copy(story, server, tokens.admin, "Jasper reader keeps mine")
    edit_body(story, copy, "Edited by a reader.")
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_text(f"library resolve {copy.id} --keep mine", "Status: Local change, not sent", actor=story.user)
    story.expect_rows(stored_copy(story, copy).state is CopyState.DENIED, server_item(server, tokens.admin, copy)["version"] == 1)


def command_review(new_story, server: SharedServerBinary, tokens, title: str) -> tuple[Story, LibraryCopy]:
    fields = {"title": title, "command": "echo hello", "brief": "Says hello", "interval_minutes": 5}
    item = server.send(tokens.admin, "POST", "/items/check", {"fields": fields})[1]
    story = connected(new_story, server, tokens.editor)
    story.expect_text(f"library get check {item['id']} --read", "is now check 1", actor=story.user)
    story.expect_text("check start 1", "check 1 started", actor=story.user)
    server.send(tokens.admin, "PUT", f"/items/check/{item['id']}", {"fields": {**fields, "command": "echo changed"}}, {"If-Match": '"1"'})
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    copy = story.container.get(Queries).query(LibraryCopy).filter(share="check").first()
    assert copy.state is CopyState.REVIEW
    return story, copy


def test_keeping_the_library_version_ends_a_new_version_to_read(new_story, shared_server):
    server, tokens = shared_server
    story, copy = command_review(new_story, server, tokens, "Topaz review library")
    story.expect_text(f"library resolve {copy.id} --keep library", "Status: In sync", actor=story.user)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, stored_copy(story, copy).base_version == 2, story.row(Check, 1).command == "echo changed")


def test_keeping_mine_ends_a_new_version_to_read_by_sending_the_text_here(new_story, shared_server):
    server, tokens = shared_server
    story, copy = command_review(new_story, server, tokens, "Agate review mine")
    story.expect_text(f"library resolve {copy.id} --keep mine", "Status: In sync", actor=story.user)
    item = server.send(tokens.admin, "GET", f"/items/check/{copy.item_id}")[1]
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, item["version"] == 3, item["fields"]["command"] == "echo hello", story.row(Check, 1).command == "echo hello")
