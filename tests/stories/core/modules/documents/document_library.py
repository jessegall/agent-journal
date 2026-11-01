import json

from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


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
    assert answer["total"] == 2
    assert [row["title"] for row in answer["rows"]] == ["Cart rules", "Shipping"]
    assert all(set(row) == {"id", "title", "abstract", "close_reason", "updated_at"} for row in answer["rows"])


def test_the_library_lists_the_reports_when_asked_for_them(new_story):
    answer = library(new_story(fixture=LibraryStocked), "document library --kind report")
    assert answer["total"] == 1
    assert [row["title"] for row in answer["rows"]] == ["Cart review"]


def test_the_library_pages_by_the_last_number_it_gave(new_story):
    answer = library(new_story(fixture=LibraryStocked), "document library --after 1")
    assert answer["total"] == 2
    assert [row["title"] for row in answer["rows"]] == ["Shipping"]


def test_the_library_shows_open_or_closed_texts_when_asked(new_story):
    story = new_story(fixture=LibraryStocked)
    story.expect_success('doc close 1 --why "It shipped"', actor=story.user)
    closed = library(story, "document library --state closed")
    assert closed["total"] == 1 and [row["title"] for row in closed["rows"]] == ["Cart rules"] and closed["rows"][0]["close_reason"] == "It shipped"
    assert [row["title"] for row in library(story, "document library --state open")["rows"]] == ["Shipping"]
    assert library(story, "document library")["total"] == 2


def test_the_documents_window_reads_the_library_and_a_text_by_number(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("documents.documents", "document library --kind report --state closed --after 25")
    window.expect_window_allowed("documents.documents", "doc show 1 --json")
