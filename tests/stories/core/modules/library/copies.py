import json
import shutil

import pytest

from engine.command.bus import Bus
from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.documents.models.doc import Doc
from suites.coding.modules.checks.models.check import Check
from core.modules.library.commands.merge_library_item.merge_library_item import MergeLibraryItem
from core.modules.library.commands.save_library_copy.save_library_copy import SaveLibraryCopy
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.copy_source import CopySource
from core.modules.library.support.kept_row import KeptRow
from core.modules.library.support.library_client import LibraryClient
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.modules.library.support.copy_stories import (server_change, connected, connection_with, copy_line, item_copy, copy_with, made_copy, new_item,
                                                                     shared_server)
from tests.stories.core.modules.library.support.stored_text import stored_texts
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder", "shared_server"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]


def test_getting_an_item_makes_one_document_and_one_copy_that_follows_it(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Quartz got", "Read it first.")
    story = connected(new_story, server, tokens.editor)
    story.expect_success(f"library get doc {item_id}", f"library doc {item_id}, version 1 is now doc 1", actor=story.agent)
    copy, doc = item_copy(story, item_id), story.row(Doc, 1)
    story.expect_rows(doc.title == "Quartz got", doc.abstract == "About Quartz got", doc.body == "Read it first.", len(list(story.story_rows(Doc))) == 1)
    story.expect_rows(copy.row_id == 1, copy.base_version == 1, copy.state is CopyState.SYNCED, len(list(story.story_rows(LibraryCopy))) == 1)
    story.expect_text("doc revision 1 1", "Read it first.", actor=story.user)


def test_getting_an_item_again_is_refused_and_names_the_row_that_follows_it(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Onyx fetched twice")
    story.expect_refusal(f"library get doc {copy.item_id}", f"library doc {copy.item_id} is already doc {copy.row_id} on this journal", actor=story.user)
    story.expect_rows(len(list(story.story_rows(Doc))) == 1)


def test_a_kind_this_journal_lacks_is_refused_in_plain_words_and_nothing_is_made(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal("library get memo 1", "this journal shares no memo with the library", actor=story.user)
    story.expect_rows(len(list(story.story_rows(LibraryCopy))) == 0)


def test_an_item_removed_from_the_library_is_not_got(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Basalt removed")
    server.send(tokens.admin, "DELETE", f"/items/doc/{item_id}")
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal(f"library get doc {item_id}", f"library doc {item_id} is removed from the library", actor=story.user)
    story.expect_rows(len(list(story.story_rows(Doc))) == 0)


def test_an_item_that_warns_is_got_only_when_it_was_read_first(new_story, shared_server):
    server, tokens = shared_server
    code, item = server.send(tokens.admin, "POST", "/items/check", {"fields": {"title": "Granite check", "command": "echo hello", "brief": "Says hello", "interval_minutes": 5}})
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal(f"library get check {item['id']}", "this check runs on your computer: echo hello", actor=story.user)
    story.expect_rows(code == 201, len(list(story.story_rows(Check))) == 0)
    story.expect_text(f"library get check {item['id']} --read", f"library check {item['id']}, version 1 is now check 1", actor=story.user)
    story.expect_rows(story.row(Check, 1).command == "echo hello", story.row(Check, 1).stopped)


def test_leaving_makes_the_row_a_plain_document_and_changes_nothing_on_the_server(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, "Marble left")
    server_item = server.send(tokens.editor, "GET", f"/items/doc/{copy.item_id}")[1]
    story.expect_success(f"library leave {copy.id}", f"doc {copy.row_id} no longer follows library doc {copy.item_id}", actor=story.user)
    story.expect_rows(item_copy(story, copy.item_id) is None, story.row(Doc, copy.row_id).title == "Marble left",
                      server.send(tokens.editor, "GET", f"/items/doc/{copy.item_id}")[1] == server_item)
    story.expect_text("library copies", "no copies", actor=story.agent)


def test_an_agent_cannot_leave_and_a_copy_that_is_not_there_is_refused(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, "Slate agent")
    story.expect_refusal(f"library leave {copy.id} --reason 'a story asks'", "an agent cannot stop following for the team", actor=story.agent)
    story.expect_refusal("library leave 99", "no library-copy 99", actor=story.user)
    story.expect_rows(item_copy(story, copy.item_id) is not None)


def test_a_copy_in_step_reads_in_sync(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, "Opal in sync")
    story.expect_rows(copy_line(story, copy) == f"copy {copy.id}: doc {copy.row_id} follows library doc {copy.item_id}, version 1. Status: In sync")


def test_a_local_change_reads_sending_while_the_server_is_reached_and_waiting_to_send_when_it_is_not(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, "Jasper local change")
    story.expect_success(f'doc edit {copy.row_id} --body "Changed here."', actor=story.user)
    story.expect_rows(copy_line(story, copy).endswith("Status: Sending"))
    connection_with(story, failure="The library cannot be reached.")
    story.expect_rows(copy_line(story, copy).endswith("Status: Waiting to send"))


def test_copies_are_filtered_by_status_and_read_as_json(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    kept = made_copy(story,server, tokens.admin, "Amber kept")
    conflicted = made_copy(story,server, tokens.admin, "Amber conflicted")
    copy_with(story, conflicted, state=CopyState.CONFLICT)
    story.expect_text("library copies --state conflict", f"copy {conflicted.id}:", actor=story.agent)
    story.expect_absent("library copies --state conflict", f"copy {kept.id}:", actor=story.agent)
    rows = json.loads(story.run("library copies --json", story.agent).output_text)
    story.expect_rows({row["status"] for row in rows["rows"]} == {"synced", "conflict"}, {row["copy_id"] for row in rows["rows"]} == {kept.id, conflicted.id})


def test_a_got_document_is_not_linked_to_the_rows_its_text_names(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Topaz mentions", "See task 1 before you start.")
    story = connected(new_story, server, tokens.editor)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.expect_text(f"library get doc {item_id}", "is now doc 1", actor=story.user)
    story.run('doc make "Plain notes" --abstract "Notes" --body "See task 1 before you start."', actor=story.user)
    story.run_listeners()
    story.expect_text("link list --source doc:2", "mentions  task:1", actor=story.user)
    story.expect_absent("link list --source doc:1", "task:1", actor=story.user)


def test_a_change_on_the_server_arrives_in_the_row_with_a_revision_of_its_own(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Quartz arrives")
    server_change(server, tokens.admin, copy.item_id, "Quartz arrives, revised", "Newer text.", 1)
    story.expect_text("library sync", "Reached the library. 1 copies followed, 1 changed.", actor=story.agent)
    doc, copy = story.row(Doc, copy.row_id), item_copy(story, copy.item_id)
    story.expect_rows(doc.title == "Quartz arrives, revised", doc.body == "Newer text.", copy.base_version == 2, copy.state is CopyState.SYNCED)
    story.expect_text(f"doc revision {doc.id} 1", "Tag first.", actor=story.user)
    story.expect_text(f"doc revision {doc.id} 2", "Newer text.", actor=story.user)
    story.expect_rows(copy_line(story, copy).endswith("version 2. Status: In sync"))


def test_a_row_that_is_gone_from_this_journal_removes_its_copy_and_never_the_item(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Opal row gone")
    story.container.get(Repository).delete(story.row(Doc, copy.row_id), Context(story.user, story.clock.timestamp(), ReadMessage(1)))
    story.expect_text("library sync", "Reached the library", actor=story.agent)
    story.expect_rows(item_copy(story, copy.item_id) is None, server.send(tokens.editor, "GET", f"/items/doc/{copy.item_id}")[0] == 200)


def test_a_check_that_was_removed_from_this_journal_loses_its_copy(new_story, shared_server):
    server, tokens = shared_server
    item = server.send(tokens.admin, "POST", "/items/check", {"fields": {"title": "Jasper check", "command": "echo hi", "brief": "Says hi", "interval_minutes": 5}})[1]
    story = connected(new_story, server, tokens.editor)
    story.expect_text(f"library get check {item['id']} --read", "is now check 1", actor=story.user)
    story.expect_text("check remove 1", "check 1", actor=story.user)
    story.expect_text("library sync", "Reached the library", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(LibraryCopy).filter(share="check", item_id=item["id"]).first() is None)


def test_a_local_edit_made_during_a_round_is_seen_by_the_next_round(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Garnet edited")
    server_change(server, tokens.admin, copy.item_id, "Garnet edited", "Server text.", 1)
    client = story.container.get(LibraryClient)
    remote_item = client.item

    def item_after_edit(share: str, item_id: int):
        story.expect_success(f'doc edit {copy.row_id} --body "Typed during the round."', actor=story.user)
        return remote_item(share, item_id)

    monkeypatch.setattr(client, "item", item_after_edit)
    story.expect_text("library sync", "Reached the library. 1 copies followed, 0 changed.", actor=story.agent)
    monkeypatch.setattr(client, "item", remote_item)
    story.expect_rows(story.row(Doc, copy.row_id).body == "Typed during the round.", item_copy(story, copy.item_id).base_version == 1)
    story.expect_text("library sync", "Reached the library. 1 copies followed, 1 changed.", actor=story.agent)
    story.expect_rows(story.row(Doc, copy.row_id).body == "Typed during the round.", item_copy(story, copy.item_id).state is CopyState.CONFLICT)


def test_one_copy_that_cannot_be_settled_stops_no_other_and_its_note_is_written_once(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Pearl beside a bad copy")
    bad = story.container.get(Repository).save(LibraryCopy(creator_id=story.user.id, share="memo", item_id=999, row_id=999, base_version=1, base_digest="x"),
                                               Context(story.user, story.clock.timestamp(), ReadMessage(1)))
    server_change(server, tokens.admin, copy.item_id, "Pearl beside a bad copy", "Server text.", 1)
    story.expect_text("library sync", "Reached the library. 2 copies followed, 2 changed.", actor=story.agent)
    story.expect_rows(story.row(Doc, copy.row_id).body == "Server text.", story.row(LibraryCopy, bad.id).note == "this journal shares no memo with the library")
    story.expect_text("library sync", "Reached the library. 2 copies followed, 0 changed.", actor=story.agent)


def test_a_sync_with_no_connection_says_so_and_changes_nothing(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("library sync", "This journal is not connected to a shared server.", actor=story.agent)


def test_a_server_that_nobody_answers_at_is_noted_once_and_the_next_round_tries_again(new_story, tmp_path):
    with SharedServerBinary(tmp_path) as server:
        story = connected(new_story, server, server.new_user("Ada", "admin"))
    story.expect_text("library sync", "Did not reach the library.", actor=story.agent)
    failure = story.container.get(Queries).query(LibraryConnection).first().failure
    story.expect_rows(bool(failure))
    stored_text = stored_texts(story)
    story.expect_text("library sync", "Did not reach the library.", actor=story.agent)
    story.expect_rows(stored_texts(story) == stored_text)


def test_an_address_that_answers_as_another_server_stops_sync_with_its_reason(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    connection_with(story, server_key="another-server")
    story.expect_text("library sync", "Did not reach the library. This address now answers as another server.", actor=story.agent)
    story.expect_text("library status", "This address now answers as another server.", actor=story.agent)
    story.expect_success("library sync", "This address now answers as another server.", actor=story.agent)


class FailingCopyWrite(Exception):
    pass


def broken_copy_save(monkeypatch) -> None:
    save, update = Repository.save, Repository.update

    def failing_save(repository, row, context):
        if isinstance(row, LibraryCopy):
            raise FailingCopyWrite()
        return save(repository, row, context)

    def failing_update(repository, row, context, **changes):
        if isinstance(row, LibraryCopy):
            raise FailingCopyWrite()
        return update(repository, row, context, **changes)

    monkeypatch.setattr(Repository, "save", failing_save)
    monkeypatch.setattr(Repository, "update", failing_update)


def test_a_copy_that_cannot_be_written_leaves_no_row_the_save_made(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    item = story.container.get(LibraryClient).item("doc", new_item(server, tokens.admin, "Saved then failed", "Body."))

    class ArrivingDoc(CopySource):
        def kept(self, share, context):
            return KeptRow(share.arrive(item.fields, context).id, "digest")

    broken_copy_save(monkeypatch)
    with pytest.raises(FailingCopyWrite):
        story.container.get(Bus).run(SaveLibraryCopy("doc", item.item_id, item.version, ArrivingDoc()), story.user)
    monkeypatch.undo()
    story.expect_rows(len(list(story.story_rows(Doc))) == 0, len(list(story.story_rows(LibraryCopy))) == 0)


def test_a_merge_whose_new_base_cannot_be_written_leaves_the_row_unchanged(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Merged then failed")
    server_change(server, tokens.admin, copy.item_id, "Merged then failed", "Server text.", 1)
    item = story.container.get(LibraryClient).item("doc", copy.item_id)
    body = story.row(Doc, copy.row_id).body
    broken_copy_save(monkeypatch)
    with pytest.raises(FailingCopyWrite):
        story.container.get(Bus).run(MergeLibraryItem(copy.id, item, story.row(Doc, copy.row_id).version), story.user)
    monkeypatch.undo()
    story.expect_rows(story.row(Doc, copy.row_id).body == body, item_copy(story, copy.item_id).base_version == 1)
