import pytest

from tests.integration.support.integration_server import integration_server
from tests.stories.engine.chat.support.mark_faults import PATH


# a user, Ada, logged in to a journal with a sample module that declares a mark and a dock
@pytest.fixture
def declarations_server(journal):
    journal.make_user()
    synced = journal.synced_with(f"{PATH}:GoodModule")
    assert synced.code == 0, synced.text
    with integration_server(journal) as server:
        yield server


def test_the_marks_on_offer_carry_their_body_url_with_the_registry_fingerprint(declarations_server):
    cookie = declarations_server.expect_viewer_login(declarations_server.viewer_key("Ada"))
    declarations_server.expect_viewer_status("/api/marks", 200, cookie, text='"type": "good.note"')
    declarations_server.expect_viewer_status("/api/marks", 200, cookie, text='"body_url": "/modules/good/note.js?v=')


def test_the_docks_on_offer_list_their_limits_and_reads(declarations_server):
    cookie = declarations_server.expect_viewer_login(declarations_server.viewer_key("Ada"))
    declarations_server.expect_viewer_status("/api/docks", 200, cookie, text='"most": 1, "leaves_after_seconds": 0, "reads": ["task list"]')


def test_marks_and_docks_are_answered_only_behind_the_login(declarations_server):
    declarations_server.expect_viewer_status("/api/marks", 401)
    declarations_server.expect_viewer_status("/api/docks", 401)
