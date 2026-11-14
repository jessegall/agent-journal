from engine.actor.actor import Actor
from engine.text.text_digest import TextDigest
from tests.stories.engine.upgrade.support.fixture_upgrade import expect_upgrade_text
from tests.stories.fixtures.version_four import SHARE_TOKEN


def test_a_live_version_4_share_moves_from_shares_and_links_and_opens_the_same_row_with_the_same_token(upgraded):
    story = upgraded
    story.expect_success("share show 1", "row_model: plan", "row_id: 3", "state: active")
    story.expect_success(f"share session {TextDigest().hex_digest(SHARE_TOKEN)}", "row_id: 3", "state: active", actor=Actor.core())


def test_a_stopped_and_an_expired_share_are_left_in_the_backup_and_counted(upgraded):
    story = upgraded
    expect_upgrade_text(story, "dropped shares stopped or past their end: 2 rows")
