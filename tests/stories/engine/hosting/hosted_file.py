import pytest

from engine.hosting.hosted_file import HostedFile
from engine.hosting.hosted_file_refusal import HostedFileRefusal
from engine.hosting.hosted_mode import HostedMode
from engine.hosting.hosting import Hosting
from engine.hosting.local_journal_refusal import LocalJournalRefusal
from tests.stories.support.story_checks import expect_value

HOSTED_TEXT = """public_origin = "https://journal.example.com"
agent_user = "journal-agent"
proxy_user = "caddy"
idle_minutes = 60
absolute_hours = 24
recent_login_minutes = 5
allow_app_codes = true
"""


def hosted_file(tmp_path, text):
    path = tmp_path / "hosted.toml"
    path.write_text(text)
    return HostedFile(path)


def test_no_hosted_file_is_a_local_journal(tmp_path):
    hosting = HostedFile(tmp_path / "hosted.toml").hosting()
    expect_value(hosting.is_hosted, False)
    with pytest.raises(LocalJournalRefusal, match="this journal is local"):
        hosting.mode


def test_a_full_hosted_file_gives_the_choices_it_holds(tmp_path):
    hosting = hosted_file(tmp_path, HOSTED_TEXT).hosting()
    expect_value(hosting.is_hosted, True)
    expect_value(hosting.mode, HostedMode("https://journal.example.com", "journal-agent", "caddy", 60, 24, 5, True))


def test_a_missing_key_is_refused_by_name_and_no_value_is_invented(tmp_path):
    without_idle = HOSTED_TEXT.replace("idle_minutes = 60\n", "")
    with pytest.raises(HostedFileRefusal, match="has no key idle_minutes"):
        hosted_file(tmp_path, without_idle).hosting()


def test_a_key_of_the_wrong_type_is_refused_by_name(tmp_path):
    with pytest.raises(HostedFileRefusal, match="the key allow_app_codes .* must be a bool"):
        hosted_file(tmp_path, HOSTED_TEXT.replace("allow_app_codes = true", 'allow_app_codes = "yes"')).hosting()


def test_a_file_that_is_not_toml_is_refused(tmp_path):
    with pytest.raises(HostedFileRefusal, match="is not valid TOML"):
        hosted_file(tmp_path, "public_origin = = 1").hosting()


def test_a_story_container_is_local_whatever_file_the_machine_holds(new_story):
    story = new_story()
    expect_value(story.container.get(Hosting), Hosting.local())
