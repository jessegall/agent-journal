from datetime import timedelta

from core.modules.sharing.models.share_link import ShareLink
from server.viewer.share_link_session import ShareLinkSession
from server.viewer.share_sessions import ShareSessions
from server.viewer.shared_row import SharedRow
from tests.stories.core.support.fixtures import PhasesPlan


def opened_session(story) -> tuple[ShareSessions, ShareLinkSession]:
    story.run("share make plans:1 --ends 1d", actor=story.user)
    row = story.row(ShareLink, 1)
    link = ShareLinkSession(row.id, row.creator_id, row.state.value, row.expires_at, SharedRow(row.row_model, row.row_id, row.environment_id), row.comments, row.locked)
    return ShareSessions(lambda arguments: "", story.clock), link


def test_a_link_is_open_until_the_clock_passes_its_end(new_story):
    story = new_story(fixture=PhasesPlan)
    shares, link = opened_session(story)
    assert shares.is_open(link)
    story.clock.advance(timedelta(hours=23))
    assert shares.is_open(link)


def test_a_link_is_closed_once_the_clock_passes_its_end(new_story):
    story = new_story(fixture=PhasesPlan)
    shares, link = opened_session(story)
    story.clock.advance(timedelta(days=1, seconds=1))
    assert not shares.is_open(link)
