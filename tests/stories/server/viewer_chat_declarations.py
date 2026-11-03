import pytest

from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, worker_run
from tests.stories.core.modules.processes.support.process_samples import end_run


def test_the_marks_on_offer_carry_their_body_url_with_the_registry_fingerprint(declarations_server):
    story = declarations_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_status("/api/marks", 200, cookie, text='"type": "good.note"')
    story.expect_viewer_status("/api/marks", 200, cookie, text='"body_url": "/modules/good/note.js?v=')


def test_the_docks_on_offer_list_their_limits_and_reads(declarations_server):
    story = declarations_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_status("/api/docks", 200, cookie, text='"most": 1, "leaves_after_seconds": 0, "reads": ["task list"]')


def test_marks_and_docks_are_answered_only_behind_the_login(declarations_server):
    story = declarations_server
    story.expect_viewer_status("/api/marks", 401)
    story.expect_viewer_status("/api/docks", 401)


def test_the_viewer_reads_reader_request_sample_lines_and_its_button(new_story):
    source = new_story(fixture=ForcedReaders)
    source.user = Actor(source.new_row_id('actor make user "Ada"'), ActorType.USER)
    process = worker_run(source)
    end_run(source, process, "first sample\n" + "middle\n" * 30 + "last sample\n")
    source.run_listeners()
    mark = source.container.get(Queries).query(ChatMark).filter(key="reader-request:1").page(1, 1).rows[0]
    with server_story(source) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        value = story.viewer_line_value(cookie, {"window": "messages.chat", "line": ["chat-mark", "main"], "environment": "main"})
        saved = next(row for row in value["rows"] if row["id"] == mark.id)
        assert "first sample" in saved["lines"] and "last sample" in saved["lines"]
        story.expect_viewer_status("/api/marks", 200, cookie, text='"runs": "output read {row_id} --tail 20"')
        story.expect_viewer_line(cookie, {"window": "messages.chat", "line": ["output", "read", str(process.id), "--tail", "20"], "environment": "main"}, 200, "last sample")
@pytest.fixture
def declarations_server(new_story):
    with server_story(new_story(f'{PATH}:GoodModule', fixture=UserJoined)) as story:
        yield story
