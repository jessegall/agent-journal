from collections import Counter

from engine.database.database import Database
from engine.registry.registry import Registry
from tests.stories.core.support.fixtures import UserJoined


def test_no_two_mark_families_are_listed_under_the_same_title_in_show_in_chat(new_story):
    story = new_story(fixture=UserJoined)
    marks = Registry.read(story.container.get(Database)).marks
    titles = Counter(title for _, title in {(mark.family, mark.family_title) for mark in marks})
    expect_title_titles(titles, 1, [])


def expect_title_titles(titles, number, expected) -> None:
    actual = [title for title, count in titles.items() if count > number]
    assert actual == expected, actual
