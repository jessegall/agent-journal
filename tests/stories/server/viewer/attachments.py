from tests.stories.server.support.server_fixtures import person_server

import pytest

import json

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_endswith_authorization, expect_value, expect_value_without

IMAGE_BYTES = b"\x89PNG\r\n\x1a\nthe cart picture"


def uploaded(story, cookie: str, name: str = "cart.png", data: bytes = IMAGE_BYTES) -> str:
    status, body = story.viewer_upload(f"/api/files?name={name}", cookie, data)
    assert status == 200, (status, body)
    return json.loads(body)["file"]


def test_a_file_is_uploaded_sent_with_a_message_and_read_back_as_the_same_bytes(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    pending = uploaded(story, cookie)
    story.story.expect_success(f'message send "see this" --file {pending} --environment main', "text: see this", actor=story.story.user)
    story.story.expect_text("message show 1", "files:", "cart.png", actor=story.story.user)
    status, data, category = story.viewer_download("/api/files/message/1/cart.png", cookie)
    expect_value(status, 200)
    expect_value(data, IMAGE_BYTES)
    expect_value(category, "image/png")


def test_a_file_is_taken_only_with_the_login_cookie(person_server):
    story = person_server
    expect_viewer_upload(story, "/api/files?name=cart.png", "", IMAGE_BYTES, 401)
    expect_viewer_download(story, "/api/files/message/1/cart.png", "", 401)


def test_a_name_with_a_path_in_it_is_cut_to_its_last_part(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    pending = uploaded(story, cookie, name="..%2F..%2Fsecret.txt")
    expect_endswith_authorization(pending, "/secret.txt")
    expect_value_without(pending, "..")


def test_a_message_names_a_file_that_was_never_uploaded_and_is_refused(person_server):
    story = person_server
    story.story.expect_refusal('message send "see this" --file ffffffffffffffff/ghost.png --environment main', "no uploaded file ffffffffffffffff/ghost.png", actor=story.story.user)


def test_a_message_without_files_has_none(person_server):
    story = person_server
    story.story.run('message send "plain" --environment main', actor=story.story.user)
    story.story.expect_absent("message show 1", "cart.png", actor=story.story.user)


def expect_viewer_download(story, text, text_2, expected) -> None:
    actual = story.viewer_download(text, text_2)[0]
    assert actual == expected, actual


def expect_viewer_upload(story, text, text_2, item, expected) -> None:
    actual = story.viewer_upload(text, text_2, item)[0]
    assert actual == expected, actual
