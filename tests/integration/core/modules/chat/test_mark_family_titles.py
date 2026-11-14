from collections import Counter

from engine.registry.registry import Registry


def expect_title_titles(titles, number, expected) -> None:
    actual = [title for title, count in titles.items() if count > number]
    assert actual == expected, actual


def test_no_two_mark_families_are_listed_under_the_same_title_in_show_in_chat(journal):
    marks = Registry.read(journal.database).marks
    titles = Counter(title for _, title in {(mark.family, mark.family_title) for mark in marks})
    expect_title_titles(titles, 1, [])
