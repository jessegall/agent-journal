import pytest

from tests.stories.engine.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story, viewer_answer
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, worker_run
from tests.stories.core.modules.processes.support.process_samples import end_run
from tests.stories.support.story_checks import expect_value, expect_value_without


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


def test_reader_requests_stay_out_of_the_viewer_chat(new_story):
    source = new_story(fixture=ForcedReaders)
    source.user = Actor(source.new_row_id('actor make user "Ada"'), ActorType.USER)
    process = worker_run(source)
    end_run(source, process, "first sample\n" + "middle\n" * 30 + "last sample\n")
    source.run_listeners()
    expect_absent_exists_source(source, "reader-request:1")
    with server_story(source) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        value = story.viewer_line_value(cookie, {"window": "messages.chat", "line": ["chat-mark", "main"], "environment": "main"})
        expect_absent_type("processes.reader_request", value)
        status, _, body = viewer_answer(story.viewer_port(), "/api/marks", cookie, "")
        expect_value(status, 200)
        expect_value_without(body, '"type": "processes.reader_request"')
        story.expect_viewer_line(cookie, {"window": "messages.chat", "line": ["reader", "draft", "1"], "environment": "main"}, 200, "does not declare reader draft")
@pytest.fixture
def declarations_server(new_story):
    with server_story(new_story(f'{PATH}:GoodModule', fixture=UserJoined)) as story:
        yield story


def expect_absent_type(text, value) -> None:
    actual = any((row['type'] == text for row in value['rows']))
    assert not actual, actual


def expect_absent_exists_source(source, text) -> None:
    actual = source.container.get(Queries).query(ChatMark).filter(key=text).exists()
    assert not actual, actual
