import shutil

import pytest

from core.modules.documents.models.doc import Doc
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.agent_edits import AGENT_EDITS_WAIT_SETTING
from core.modules.library.support.library_client import LibraryClient
from core.testing.story import Story
from tests.stories.core.modules.library.support.copy_stories import connected, copy_line, made_copy, shared_server
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder", "shared_server"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

CHANGED_SINGLE = "Reached the library. 1 copies followed, 1 changed."
CHANGED_NONE = "Reached the library. 1 copies followed, 0 changed."


def server_body(server: SharedServerBinary, token: str, copy: LibraryCopy) -> str:
    return str(server.send(token, "GET", f"/items/doc/{copy.item_id}")[1]["fields"]["body"])


def stored_copy(story: Story, copy: LibraryCopy) -> LibraryCopy:
    return story.row(LibraryCopy, copy.id)


def edit_body(story: Story, copy: LibraryCopy, body: str, agent: bool) -> None:
    if not agent:
        story.expect_success(f'doc edit {copy.row_id} --body "{body}"', actor=story.user)
        return
    story.expect_success(f"doc open {copy.row_id}", actor=story.agent)
    story.expect_success(f'doc edit {copy.row_id} --body "{body}"', actor=story.agent)
    story.expect_success(f"doc close {copy.row_id}", actor=story.agent)


def test_an_edit_by_an_agent_stays_on_this_journal_until_a_person_sends_it(new_story, shared_server, monkeypatch):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Quartz agent edit")
    edit_body(story, copy, "Edited by an agent.", agent=True)
    updates = []
    client = story.container.get(LibraryClient)
    real_update = client.update
    monkeypatch.setattr(client, "update", lambda *arguments: updates.append(arguments) or real_update(*arguments))
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_text("library sync", CHANGED_NONE, actor=story.agent)
    story.expect_rows(updates == [], stored_copy(story, copy).state is CopyState.AGENT, server_body(server, tokens.admin, copy) == "Tag first.")
    story.expect_rows(copy_line(story, copy).endswith("Status: Agent change, not sent"))
    story.expect_text(f"library resolve {copy.id} --keep mine", "Status: In sync", actor=story.user)
    story.expect_rows(len(updates) == 1, stored_copy(story, copy).state is CopyState.SYNCED, server_body(server, tokens.admin, copy) == "Edited by an agent.")


def test_an_edit_by_a_person_goes_up_by_itself(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Basalt person edit")
    edit_body(story, copy, "Edited by a person.", agent=False)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, server_body(server, tokens.admin, copy) == "Edited by a person.")


def test_a_person_who_edits_after_an_agent_sends_both_changes(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Slate both edits")
    edit_body(story, copy, "Edited by an agent.", agent=True)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    edit_body(story, copy, "Edited by a person after the agent.", agent=False)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, server_body(server, tokens.admin, copy) == "Edited by a person after the agent.")


def test_an_agent_change_that_is_undone_leaves_the_copy_in_sync(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Opal agent undone")
    edit_body(story, copy, "Edited by an agent.", agent=True)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    edit_body(story, copy, "Tag first.", agent=True)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, copy_line(story, copy).endswith("Status: In sync"))


def test_the_library_version_replaces_an_agent_change_a_person_does_not_want(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Garnet agent discarded")
    edit_body(story, copy, "Edited by an agent.", agent=True)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_text(f"library resolve {copy.id} --keep library", "Status: In sync", actor=story.user)
    story.expect_rows(story.row(Doc, copy.row_id).body == "Tag first.", server_body(server, tokens.admin, copy) == "Tag first.")
    story.expect_text(f"doc revision {copy.row_id} 2", "Edited by an agent.", actor=story.user)


def test_an_agent_cannot_send_an_agent_change(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Pearl agent cannot send")
    edit_body(story, copy, "Edited by an agent.", agent=True)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_refusal(f"library resolve {copy.id} --keep mine", "only a person chooses between a copy and its item", actor=story.agent)
    story.expect_rows(server_body(server, tokens.admin, copy) == "Tag first.")


def test_with_the_setting_off_an_edit_by_an_agent_goes_up_by_itself(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.expect_success(f"setting set {AGENT_EDITS_WAIT_SETTING} false --project", actor=story.user)
    copy = made_copy(story, server, tokens.admin, "Jasper setting off")
    edit_body(story, copy, "Edited by an agent.", agent=True)
    story.expect_text("library sync", CHANGED_SINGLE, actor=story.agent)
    story.expect_rows(stored_copy(story, copy).state is CopyState.SYNCED, server_body(server, tokens.admin, copy) == "Edited by an agent.")
