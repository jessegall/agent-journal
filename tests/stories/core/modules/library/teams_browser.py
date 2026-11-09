import os
import shutil
from pathlib import Path

import pytest

from core.base.query.queries import Queries
from core.modules.library.models.library_copy import LibraryCopy
from tests.stories.core.modules.library.support.stored_text import stored_texts
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder"]

CHROME = Path(os.environ.get("CHROMIUM_PATH", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"))

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"),
              pytest.mark.skipif(not CHROME.exists(), reason="the page is checked in a real browser"), pytest.mark.usefixtures("private_folder")]

WORD = "quartzite"


def test_a_person_connects_reads_searches_and_shares_from_the_teams_page(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CHROMIUM_PATH", str(CHROME))
    with SharedServerBinary(tmp_path) as shared:
        token = shared.new_user("Grace", "edit")
        shared.send(token, "POST", "/items/doc", {"fields": {"title": f"Release {WORD}", "abstract": "What to do before a release", "body": "Tag first."}})
        shared.send(token, "POST", "/items/doc", {"fields": {"title": "Other notes", "abstract": "Not the same", "body": "Nothing here."}})
        story = new_story(fixture=UserBuilder)
        story.expect_success("setting set journal.core.viewer.tour-completed true --project")
        made = story.run('doc make "Local notes" --abstract "Notes to share" --body "Build then tag."', story.user)
        row_number = made.output_text.split(":")[0].split()[1]
        with server_story(story) as server:
            expect_browser(server, "teams.browser.mjs", [shared.address, token, WORD, row_number])
        copy = story.container.get(Queries).query(LibraryCopy).filter(share="doc", row_id=int(row_number)).first()
        story.expect_rows(copy is not None, token not in stored_texts(story))
