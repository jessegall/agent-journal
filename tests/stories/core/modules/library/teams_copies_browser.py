import json
import os
import shlex
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.documents.models.doc import Doc
from core.modules.sequences.models.sequence import Sequence
from suites.coding.modules.checks.models.check import Check
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


def test_story_11_a_check_shows_its_command_before_it_is_got_and_a_changed_command_waits_to_be_read(new_story, team):
    server, tokens = team
    fields = {"title": "Migrations are reversible", "command": "echo old", "brief": "Checks the migrations", "interval_minutes": 0}
    item_id = int(str(server.send(tokens.admin, "POST", "/items/check", {"fields": fields})[1]["id"]))
    story = journal(new_story, server, tokens.editor)
    browse(story, {"expect": "Migrations are reversible"}, {"click": "[data-library-get]"}, {"expect": "This check runs this command on your computer when someone starts it:"},
           {"expect": "echo old"}, {"click": "[data-library-confirm]"}, {"expect": "On this journal"}, COPIES, {"expect": "Status: In sync, Version: 1"})
    story.expect_text("check list", "stopped", "Migrations are reversible", actor=story.user)
    story.expect_text("check start 1", "check 1 started", actor=story.user)
    server.send(tokens.admin, "PUT", f"/items/check/{item_id}", {"fields": {**fields, "command": "echo new"}}, {"If-Match": '"1"'})
    browse(story, COPIES, SYNC, {"expect": "Status: New version to read"}, {"expect": "The command of this check changed."}, {"button": "Read"}, {"expect": "echo new"}, {"press": "Escape"},
           {"button": "Use the library's version"}, {"expect": "a check keeps no earlier versions"}, {"click": "[data-library-take]"}, {"expect": "Status: In sync, Version: 2"})
    story.expect_rows(story.row(Check, 1).command == "echo new", not story.row(Check, 1).stopped)


def test_story_12_a_sequence_arrives_without_its_trigger_and_new_steps_wait_for_a_run_and_for_reading(new_story, team):
    server, tokens = team
    steps = json.dumps(["Run the suite", "Tag the release"])
    item_id = int(str(server.send(tokens.admin, "POST", "/items/sequence", {"fields": {"title": "Cut a release", "steps": steps, "step_guards": "[]"}})[1]["id"]))
    story = journal(new_story, server, tokens.editor)
    browse(story, {"expect": "Cut a release"}, {"click": "[data-library-get]"}, {"expect": "On this journal"}, COPIES, {"expect": "Status: In sync, Version: 1"})
    story.expect_text("sequence show 1", "starts by hand only", "1. Run the suite", "2. Tag the release", actor=story.user)
    story.expect_text("sequence run 1", "Run the suite", actor=story.agent)
    server.send(tokens.admin, "PUT", f"/items/sequence/{item_id}", {"fields": {"title": "Cut a release", "steps": json.dumps(["Run the suite", "Tag it", "Announce it"]), "step_guards": "[]"}}, {"If-Match": '"1"'})
    browse(story, COPIES, SYNC, {"expect": "Status: Waiting for its run to end"})
    story.run("sequence follow", actor=story.agent)
    story.expect_text('sequence abandon --why "not today" --sure', "sequence 1 abandoned", actor=story.agent)
    browse(story, COPIES, SYNC, {"expect": "Status: In sync, Version: 2"})
    story.expect_text("sequence show 1", "3. Announce it", actor=story.user)
    triggers = json.dumps([{"trigger_type": "phrase", "text": "give me an update"}])
    story.expect_text(f"sequence edit 1 --triggers {shlex.quote(triggers)}", "updated: sequence:1", actor=story.user)
    server.send(tokens.admin, "PUT", f"/items/sequence/{item_id}", {"fields": {"title": "Cut a release", "steps": json.dumps(["Run the suite", "Announce it"]), "step_guards": "[]"}}, {"If-Match": '"2"'})
    browse(story, COPIES, SYNC, {"expect": "Status: New version to read"}, {"expect": "The steps of this sequence changed."}, {"button": "Read"}, {"expect": "Tag it"}, {"press": "Escape"},
           {"button": "Use the library's version"}, {"expect": "a sequence keeps no earlier versions"}, {"click": "[data-library-take]"}, {"expect": "Status: In sync, Version: 3"})
    story.expect_rows(len(story.row(Sequence, 1).steps) == 2)


def user_numbers(server: SharedServerBinary, token: str) -> dict[str, int]:
    return {user["name"]: int(str(user["id"])) for user in server.send(token, "GET", "/users")[1]["users"]}


def test_story_7_an_admin_gives_a_read_only_user_edit_rights_from_the_page(new_story, team):
    server, tokens = team
    story = journal(new_story, server, tokens.admin)
    linus = user_numbers(server, tokens.admin)["Linus"]
    item = {"fields": {"title": "Needs edit", "abstract": "About", "body": "Text"}}
    story.expect_rows(server.send(tokens.reader, "POST", "/items/doc", item)[0] == 403)
    browse(story, {"tab": "People"}, {"expect": "Linus"}, {"click": f'[data-people-user="{linus}"] [data-people-role] button:has-text("Edit")'},
           {"wait": f'[data-people-user="{linus}"] [data-people-role] button[aria-checked="true"]:has-text("Edit")'})
    story.expect_rows(server.send(tokens.reader, "POST", "/items/doc", item)[0] == 201)


def test_story_15_a_lost_laptop_has_its_one_token_revoked_from_the_page_and_the_other_device_keeps_working(new_story, team):
    server, tokens = team
    story = journal(new_story, server, tokens.admin)
    grace = user_numbers(server, tokens.admin)["Grace"]
    phone = server.send(tokens.admin, "POST", f"/users/{grace}/tokens", {"label": "Phone"})[1]["token_text"]
    laptop = server.send(tokens.admin, "POST", f"/users/{grace}/tokens", {"label": "Laptop"})[1]
    story.expect_rows(server.send(str(laptop["token_text"]), "GET", "/me")[0] == 200, server.send(str(phone), "GET", "/me")[0] == 200)
    number = int(str(laptop["token"]["id"]))
    browse(story, {"tab": "People"}, {"expect": "Grace"}, {"click": f'[data-people-user="{grace}"] [data-people-tokens]'}, {"expect": "Laptop, Last used:"},
           {"click": f'[data-people-token="{number}"] [data-people-revoke]'}, {"wait": f'[data-people-token="{number}"] [data-people-revoked]'})
    story.expect_rows(server.send(str(laptop["token_text"]), "GET", "/me")[0] == 401, server.send(str(phone), "GET", "/me")[0] == 200, server.send(tokens.editor, "GET", "/me")[0] == 200)


def test_a_user_who_may_not_administer_sees_no_people_tab_and_the_server_refuses_the_route(new_story, team):
    server, tokens = team
    story = journal(new_story, server, tokens.editor)
    browse(story, COPIES, {"expect": "On this journal"}, {"absent": "People"})
    story.expect_refusal("library-user list", "your role cannot do this", actor=story.agent)
    story.expect_rows(server.send(tokens.editor, "GET", "/users")[0] == 403)
