import json

from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


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


def test_every_attached_file_is_listed_newest_first_with_the_counts_of_each_kind(new_story):
    answer = listed(attached_story(new_story))
    assert [row["name"] for row in answer["rows"]] == ["shop.jpg", "notes.txt", "cart.png"]
    assert answer["counts"] == {"all": 3, "images": 2, "other": 1} and answer["is_last_page"]
    assert answer["rows"][0]["is_image"] and not answer["rows"][1]["is_image"]


def test_the_kinds_keep_images_or_the_rest(new_story):
    story = attached_story(new_story)
    assert [row["name"] for row in listed(story, "--kind images")["rows"]] == ["shop.jpg", "cart.png"]
    assert [row["name"] for row in listed(story, "--kind other")["rows"]] == ["notes.txt"]


def test_a_search_finds_a_file_by_its_name_or_its_message_and_counts_only_what_it_found(new_story):
    story = attached_story(new_story)
    assert [row["name"] for row in listed(story, "--search notes")["rows"]] == ["notes.txt"]
    answer = listed(story, '--search "the shop"')
    assert [row["name"] for row in answer["rows"]] == ["shop.jpg"] and answer["counts"]["all"] == 1


def test_files_are_paged(new_story):
    story = attached_story(new_story)
    first = listed(story, "--limit 2")
    assert len(first["rows"]) == 2 and not first["is_last_page"]
    assert [row["name"] for row in listed(story, "--limit 2 --skip 2")["rows"]] == ["cart.png"]


def test_the_window_declares_its_read(new_story):
    WindowStory(new_story(fixture=UserJoined)).expect_window_allowed("messages.attachments", 'attachment list --kind images --skip 60 --search "a b"')
