from tests.stories.core.modules.updates.support.release_folder import ARCHIVE, installed_marker, published, released_story
from tests.stories.core.modules.viewer.support.window_story import WindowStory


def test_a_journal_whose_release_is_not_recorded_is_told_how_to_put_the_newest_in(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    story.expect_text("update check", "the release this journal runs is not recorded: journal update install puts in the newest release", actor=story.agent)


def test_install_puts_the_newest_release_into_the_journals_code_and_records_it(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    story.expect_success("update install", "the newest release is installed in .journal/src: the journal runs it from its next request", actor=story.user)
    story.expect_text("update check", "up to date: this journal runs the newest release", actor=story.agent)
    story.expect_text("release list", "1", actor=story.user)
    story.expect_rows(installed_marker(story) == "release one")


def test_a_newer_release_is_found_by_its_checksum(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    story.expect_success("update install", actor=story.user)
    published(tmp_path / "release", "release two")
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


def test_only_the_user_installs_a_release(new_story, tmp_path):
    story = released_story(new_story, tmp_path / "release")
    story.expect_refusal("update install", "only the user installs a release, with the Install button on the Updates window", actor=story.agent)
    story.expect_rows(installed_marker(story) == "")


def test_the_updates_window_checks_and_lists_the_installed_releases(new_story, tmp_path):
    window = WindowStory(released_story(new_story, tmp_path / "release"))
    window.expect_window_allowed("updates.updates", "update check")
    window.expect_window_allowed("updates.updates", "release list")
    window.expect_window_allowed("updates.updates", "update install")
