import json
import os
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.documents.models.doc import Doc
from core.modules.library.models.library_copy import LibraryCopy
from core.testing.story import Story
from tests.stories.core.modules.library.support.copy_stories import (Tokens, change_on_server, connected, connection_with, copy_of_item, made_copy, new_item)
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder"]

CHROME = Path(os.environ.get("CHROMIUM_PATH", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"))

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"),
              pytest.mark.skipif(not CHROME.exists(), reason="the page is checked in a real browser"), pytest.mark.usefixtures("private_folder")]

COPIES = {"tab": "On this journal"}
SYNC = {"click": "[data-teams-sync]"}


@pytest.fixture
def team(tmp_path, monkeypatch):
    monkeypatch.setenv("CHROMIUM_PATH", str(CHROME))
    with SharedServerBinary(tmp_path) as server:
        yield server, Tokens(server.new_user("Ada", "admin"), server.new_user("Grace", "edit"), server.new_user("Linus", "read"))


def journal(new_story, server: SharedServerBinary, token: str) -> Story:
    story = connected(new_story, server, token)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    return story


def browse(story: Story, *plan: dict[str, object]) -> None:
    with server_story(story) as viewer:
        expect_browser(viewer, "teamsCopies.browser.mjs", [json.dumps(plan)])


def test_story_4_a_person_gets_a_document_and_a_change_of_the_library_arrives_as_a_revision(new_story, team):
    server, tokens = team
    item_id = new_item(server, tokens.admin, "Release checklist", "Tag first.")
    story = journal(new_story, server, tokens.editor)
    browse(story, {"expect": "Release checklist"}, {"click": "[data-library-get]"}, {"expect": "On this journal"}, COPIES, {"expect": "Status: In sync, Version: 1"})
    copy = copy_of_item(story, item_id)
    change_on_server(server, tokens.admin, item_id, "Release checklist", "Tag first, then build.", 1)
    browse(story, COPIES, SYNC, {"expect": "Status: In sync, Version: 2"})
    story.expect_rows(story.row(Doc, copy.row_id).body == "Tag first, then build.")
    story.expect_text(f"doc revisions {copy.row_id}", "2", actor=story.user)


def test_story_5_an_edit_with_write_access_goes_from_sending_to_in_sync(new_story, team):
    server, tokens = team
    story = journal(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Release notes")
    story.expect_success(f'doc edit {copy.row_id} --body "Edited here."', actor=story.user)
    browse(story, COPIES, {"expect": "Status: Sending"}, SYNC, {"expect": "Status: In sync, Version: 2"})
    story.expect_rows(server.send(tokens.admin, "GET", f"/items/doc/{copy.item_id}")[1]["fields"]["body"] == "Edited here.")


def test_story_6_an_edit_without_write_access_stays_and_a_newer_version_does_not_overwrite_it(new_story, team):
    server, tokens = team
    story = journal(new_story, server, tokens.reader)
    copy = made_copy(story, server, tokens.admin, "Read only notes")
    story.expect_success(f'doc edit {copy.row_id} --body "Edited by Linus."', actor=story.user)
    browse(story, COPIES, SYNC, {"expect": "Status: Local change, not sent"}, {"expect": "Role: Read-only"}, {"absent": "Keep mine"})
    change_on_server(server, tokens.admin, copy.item_id, "Read only notes", "Admin text.", 1)
    browse(story, COPIES, SYNC, {"expect": "A newer version is in the library"}, {"expect": "Compare"}, {"expect": "Use the library's version"}, {"absent": "Keep mine"})
    story.expect_rows(story.row(Doc, copy.row_id).body == "Edited by Linus.")


def test_story_10_two_people_edit_at_the_same_time_and_nothing_is_overwritten_until_one_is_chosen(new_story, team):
    server, tokens = team
    story = journal(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Cart rules")
    story.expect_success(f'doc edit {copy.row_id} --body "Edited by Grace."', actor=story.user)
    change_on_server(server, tokens.admin, copy.item_id, "Cart rules", "Edited by Ada.", 1)
    browse(story, COPIES, SYNC, {"expect": "Status: Conflict"}, {"button": "Compare"}, {"expect": "Red lines are only on this journal"}, {"expect": "Edited by Ada."},
           {"press": "Escape"}, {"button": "Use the library's version"}, {"expect": "Status: In sync, Version: 2"})
    story.expect_rows(story.row(Doc, copy.row_id).body == "Edited by Ada.")
    story.expect_text(f"doc revision {copy.row_id} 2", "Edited by Grace.", actor=story.user)


def test_story_13_a_journal_that_cannot_reach_the_server_says_what_is_waiting(new_story, team):
    server, tokens = team
    story = journal(new_story, server, tokens.editor)
    first = made_copy(story, server, tokens.admin, "Offline first")
    second = made_copy(story, server, tokens.admin, "Offline second")
    story.expect_success(f'doc edit {first.row_id} --body "Edited offline."', actor=story.user)
    story.expect_success(f'doc edit {second.row_id} --body "Edited offline too."', actor=story.user)
    connection_with(story, failure="The library cannot be reached.", reached_at=Timestamp(datetime.now(timezone.utc) - timedelta(days=1)))
    browse(story, {"expect": "Last reached: 1d ago"}, COPIES, {"expect": "Status: Waiting to send"})
    story.expect_rows(story.row(Doc, first.row_id).body == "Edited offline.")


def test_story_14_an_item_removed_from_the_library_stays_here_until_the_person_stops_following(new_story, team):
    server, tokens = team
    story = journal(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Removed notes")
    server.send(tokens.admin, "DELETE", f"/items/doc/{copy.item_id}")
    browse(story, COPIES, SYNC, {"expect": "Status: Removed from the library"}, {"expect": "Your copy stays on this journal."}, {"button": "Stop following"},
           {"expect": "No item on this journal follows an item of the library"})
    story.expect_rows(story.row(Doc, copy.row_id).title == "Removed notes", copy_of_item(story, copy.item_id) is None)


def test_story_16_stopping_to_follow_leaves_both_sides_as_they_are(new_story, team):
    server, tokens = team
    story = journal(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Followed notes")
    browse(story, COPIES, {"expect": "Status: In sync, Version: 1"}, {"button": "Stop following"}, {"expect": "No item on this journal follows an item of the library"})
    story.expect_rows(story.row(Doc, copy.row_id).title == "Followed notes", copy_of_item(story, copy.item_id) is None,
                      server.send(tokens.admin, "GET", f"/items/doc/{copy.item_id}")[1]["version"] == 1)
    story.expect_rows(story.container.get(Queries).query(LibraryCopy).filter(share="doc").first() is None)
