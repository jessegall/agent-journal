import json

from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_total_closed


class LibraryStocked(StoryFixture):
    """Two documents, Cart rules (1) and Shipping (2), and one report, Cart review (1)."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        story.run('doc make "Cart rules" --abstract "How the cart counts money" --body "## Totals\\nin cents"', actor=story.user)
        story.run('doc make "Shipping" --abstract "How parcels are priced" --body "## Weight\\nby the gram"', actor=story.user)
        story.run('report make "Cart review" --abstract "What the review found" --body "## Found\\nnothing"', actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text("doc list", "Shipping", actor=story.user)


def library(story, line: str) -> dict:
    return json.loads(story.run(f"{line} --json", actor=story.user).output_text)


def test_the_library_lists_the_documents_with_no_text(new_story):
    answer = library(new_story(fixture=LibraryStocked), "document library")
    expect_row(answer, total=2)
    expect_title_closed(answer, ["Shipping", "Cart rules"])
    expect_answer_2("id", "title", "abstract", "close_reason", "updated_at", answer)


def test_the_library_lists_the_reports_when_asked_for_them(new_story):
    answer = library(new_story(fixture=LibraryStocked), "document library --type report")
    expect_row(answer, total=1)
    expect_title_closed(answer, ["Cart review"])


def test_the_library_pages_before_the_lowest_number_it_gave(new_story):
    answer = library(new_story(fixture=LibraryStocked), "document library --before 2")
    expect_row(answer, total=2)
    expect_title_closed(answer, ["Cart rules"])


def test_the_library_shows_open_or_closed_texts_when_asked(new_story):
    story = new_story(fixture=LibraryStocked)
    story.expect_success('doc settle 1 --why "It shipped"', actor=story.user)
    closed = library(story, "document library --state closed")
    expect_total_closed(closed, 1)
    expect_title_closed(closed, ["Cart rules"])
    expect_close_reason_closed(closed, "It shipped")
    expect_title_library(story, "document library --state open", ["Shipping"])
    expect_row(library(story, "document library"), total=2)


def test_the_documents_window_reads_the_library_and_a_text_by_number(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("documents.documents", "document library --type report --state closed --before 25")
    window.expect_window_allowed("documents.documents", "doc show 1 --json")


def test_the_documents_window_can_stand_in_a_pane_or_on_a_page_of_its_own(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_declared_window("documents.documents", "component", "pane_or_page")


def expect_title_library(story, text, expected) -> None:
    actual = [row['title'] for row in library(story, text)['rows']]
    assert actual == expected, actual


def expect_title_closed(closed, expected) -> None:
    actual = [row['title'] for row in closed['rows']]
    assert actual == expected, actual


def expect_close_reason_closed(closed, expected) -> None:
    actual = closed['rows'][0]['close_reason']
    assert actual == expected, actual


def expect_answer_2(text, text_2, text_3, text_4, text_5, answer) -> None:
    actual = all((set(row) == {text, text_2, text_3, text_4, text_5} for row in answer['rows']))
    assert actual, actual
