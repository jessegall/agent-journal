import pytest

import json

from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_absent_last, expect_last_answer


def attached_story(new_story):
    story = new_story(fixture=UserJoined)
    for token, name, text in (("aaaaaaaaaaaaaaaa", "cart.png", "the cart"), ("bbbbbbbbbbbbbbbb", "notes.txt", "my notes"), ("cccccccccccccccc", "shop.jpg", "the shop")):
        pending = story.home.pending_files / token
        pending.mkdir(parents=True)
        (pending / name).write_text("file")
        story.expect_text(f'message send "{text}" --file {token}/{name} --environment main', "", actor=story.user)
    story.run('message send "no file here" --environment main', actor=story.user)
    return story


def listed(story, flags: str = "") -> dict:
    return json.loads(story.run(f"attachment list --environment main --json {flags}", actor=story.user).output_text)


def test_every_attached_file_is_listed_newest_first_with_the_counts_of_each_kind(message_attachments):
    answer = listed(message_attachments)
    expect_answer_3(answer, ["shop.jpg", "notes.txt", "cart.png"])
    expect_counts_answer_2(answer, {"all": 3, "images": 2, "other": 1})
    expect_last_answer(answer)
    expect_image_answer(answer)
    expect_absent_image_answer(answer)


def test_the_kinds_keep_images_or_the_rest(message_attachments):
    story = message_attachments
    expect_listed_2(story, "--category images", ["shop.jpg", "cart.png"])
    expect_listed_2(story, "--category other", ["notes.txt"])


def test_a_search_finds_a_file_by_its_name_or_its_message_and_counts_only_what_it_found(message_attachments):
    story = message_attachments
    expect_listed_2(story, "--search notes", ["notes.txt"])
    answer = listed(story, '--search "the shop"')
    expect_answer_3(answer, ["shop.jpg"])
    expect_counts_answer(answer, 1)


def test_files_are_paged(message_attachments):
    story = message_attachments
    first = listed(story, "--limit 2")
    expect_value_6(first, 2)
    expect_absent_last(first)
    expect_listed_2(story, "--limit 2 --skip 2", ["cart.png"])


def test_the_window_declares_its_read(new_story):
    WindowStory(new_story(fixture=UserJoined)).expect_window_allowed("messages.attachments", 'attachment list --category images --skip 60 --search "a b"')


@pytest.fixture
def message_attachments(new_story):
    return attached_story(new_story)


def expect_listed_2(story, text, expected) -> None:
    actual = [row['name'] for row in listed(story, text)['rows']]
    assert actual == expected, actual


def expect_value_6(first, expected) -> None:
    actual = len(first['rows'])
    assert actual == expected, actual


def expect_answer_3(answer, expected) -> None:
    actual = [row['name'] for row in answer['rows']]
    assert actual == expected, actual


def expect_counts_answer(answer, expected) -> None:
    actual = answer['counts']['all']
    assert actual == expected, actual


def expect_image_answer(answer) -> None:
    actual = answer['rows'][0]['is_image']
    assert actual, actual


def expect_absent_image_answer(answer) -> None:
    actual = answer['rows'][1]['is_image']
    assert not actual, actual


def expect_counts_answer_2(answer, expected) -> None:
    actual = answer['counts']
    assert actual == expected, actual
