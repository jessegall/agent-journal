from datetime import timedelta
import threading

import json
from urllib.error import HTTPError

import pytest

from core.modules.updates.support.release_notes import PAGE_SIZE
from core.modules.updates.support.release_source import ReleaseSource
from tests.stories.core.modules.updates.support.release_folder import ARCHIVE, installed_marker, published, released_story
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_absent_last, expect_answers
from engine.serving.code_handover import CodeHandover
from engine.serving.server_files import ServerFiles


def test_a_journal_whose_release_is_not_recorded_is_told_how_to_put_the_newest_in(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    story.expect_text("update check", "the release this journal runs is not recorded: journal update install puts in the newest release", actor=story.agent)


def test_install_puts_the_newest_release_into_the_journals_code_and_records_it(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    story.expect_success("update install", "the newest release is installed", actor=story.user)
    story.expect_text("update check", "up to date: this journal runs the newest release", actor=story.agent)
    story.expect_text("release list", "1", actor=story.user)
    story.expect_rows(installed_marker(story) == "release one")


def test_a_pending_handover_records_no_installed_release(new_story, tmp_path, monkeypatch):
    story = released_story(new_story, tmp_path / "release")
    ServerFiles(story.home).pid_file.write_text("running")
    release = threading.Event()
    finished = threading.Event()

    def takeover_status(self, tag):
        release.wait(5)
        finished.set()
        return 503

    monkeypatch.setattr(CodeHandover, "takeover_status", takeover_status)
    try:
        story.expect_success("update install", actor=story.agent)
        releases = json.loads(story.run("release list --json").output_text)["rows"]
        story.expect_rows(releases == [])
        expect_pending_update(story)
    finally:
        release.set()
        finished.wait(5)
        for thread in threading.enumerate():
            if thread.name == "code handover":
                thread.join(5)


def expect_pending_update(story):
    check = json.loads(story.run("update check --json").output_text)
    assert check["is_current"] is False, check
    assert "installation started" in check["line"], check


def test_a_newer_release_is_found_by_its_checksum(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    story.expect_success("update install", actor=story.user)
    published(tmp_path / "release", "release two")
    story.expect_text("update check", "up to date: this journal runs the newest release", actor=story.agent)
    story.advance(timedelta(hours=1, minutes=1))
    story.expect_text("update check", "a newer release is out: journal update install puts it in", actor=story.agent)


def test_an_archive_whose_checksum_does_not_match_is_refused_and_nothing_changes(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    (tmp_path / "release" / ARCHIVE).write_bytes(b"not the release")
    story.expect_refusal("update install", "the checksum of agent-journal.tar.gz does not match the release's, so nothing was installed", actor=story.user)
    story.expect_rows(installed_marker(story) == "")


def test_a_release_that_cannot_be_read_is_refused_with_its_address(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    (tmp_path / "release" / "checksums.txt").unlink()
    story.expect_refusal("update check", f"the release at {(tmp_path / 'release').as_uri()} could not be read", actor=story.agent)


@pytest.mark.parametrize(("status", "expected"), [(404, "No installable release was found"), (403, "could not be read")])
def test_missing_release_downloads_and_denied_reads_have_distinct_messages(new_story, tmp_path, monkeypatch, status, expected):
    def unavailable(address, timeout):
        raise HTTPError(address, status, "download unavailable", None, None)

    story = released_story(new_story, tmp_path / "release")
    monkeypatch.setattr("urllib.request.urlopen", unavailable)
    story.expect_refusal("update check", expected, actor=story.agent)


def test_an_agent_installs_a_release(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    story.expect_success("update install", actor=story.agent)
    story.expect_rows(installed_marker(story) != "")


class GithubReleases(ReleaseSource):
    """A release source at a GitHub address that answers from a list a story sets, and records what it was asked."""

    def __init__(self, settings, home, clock, rows: list[dict]) -> None:
        super().__init__(settings, home, clock)
        self.rows, self.asked = rows, []

    def address(self) -> str:
        return "https://github.com/shop/cart/releases/latest/download"

    def fetched(self, address: str) -> tuple[bytes, str]:
        self.asked.append(address)
        return json.dumps(self.rows).encode(), address


def note_row(tag: str) -> dict:
    return {"tag_name": tag, "body": f"changes of {tag}", "published_at": "2026-10-01T10:00:00Z"}


def test_the_notes_of_a_github_release_say_what_changed_and_a_full_page_has_older_ones(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    source = GithubReleases(story.container.get(ReleaseSource).settings, story.container.get(ReleaseSource).home, story.container.get(ReleaseSource).clock, [note_row(f"v{n}") for n in range(PAGE_SIZE)])
    story.bind(ReleaseSource, source)
    answer = json.loads(story.run("update notes --page 2 --json", actor=story.user).output_text)
    expect_notes_answer(answer, {"tag": "v0", "text": "changes of v0", "published_at": "2026-10-01T10:00:00Z"})
    expect_absent_last(answer)
    expect_row(source, asked=[f"https://api.github.com/repos/shop/cart/releases?per_page={PAGE_SIZE}&page=2"])
    source.rows = [note_row("v1")]
    expect_last(story, "update notes --json")


def test_a_release_address_outside_github_publishes_no_notes(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    expect_value_14(story, "update notes --json", {"notes": [], "is_last_page": True})


def test_the_check_names_the_newest_release_for_the_update_button(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    expect_value_with_2(story, "update check --json", "tag")


def test_a_check_asked_again_within_the_hour_makes_no_second_network_read_and_an_install_reads_fresh(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    source = story.container.get(ReleaseSource)
    reads = []
    original = source.fetched_newest
    source.fetched_newest = lambda address: (reads.append(address), original(address))[1]
    story.bind(ReleaseSource, source)
    story.expect_text("update check", "release", actor=story.agent)
    story.expect_text("update check", "release", actor=story.agent)
    expect_answers(reads, 1)
    story.expect_success("update install", actor=story.user)
    expect_answers(reads, 2)


def expect_value_with_2(story, text, expected) -> None:
    actual = json.loads(story.run(text, actor=story.user).output_text)
    assert expected in actual, actual


def expect_value_14(story, text, expected) -> None:
    actual = json.loads(story.run(text, actor=story.user).output_text)
    assert actual == expected, actual


def expect_last(story, text) -> None:
    actual = json.loads(story.run(text, actor=story.user).output_text)['is_last_page']
    assert actual, actual


def expect_notes_answer(answer, expected) -> None:
    actual = answer['notes'][0]
    assert actual == expected, actual
