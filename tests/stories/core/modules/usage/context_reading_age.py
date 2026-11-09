from datetime import datetime, timezone

from core.base.timestamp import Timestamp
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from tests.stories.core.modules.usage.support.status_files import keep_status_file, rewrite_status_file, save_status_file
from tests.stories.core.support.fixtures import MainEnvironment

SESSION = "s-age"
HIGH_TOKENS = 300000
LOW_TOKENS = 40000


def window(story):
    return story.container.get(ClaudeCodeProvider).context_window(story.home, SESSION)


def modified_at(story) -> Timestamp:
    path = story.home.status_folder / f"{SESSION}.json"
    return Timestamp(datetime.fromtimestamp(path.stat().st_mtime, timezone.utc))


def test_a_context_window_carries_the_time_its_status_file_was_modified(new_story):
    story = new_story(fixture=MainEnvironment)
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": HIGH_TOKENS}})
    story.expect_rows(window(story).read_at == modified_at(story))


def test_a_rewritten_status_file_is_read_later_than_before(new_story):
    story = new_story(fixture=MainEnvironment)
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": HIGH_TOKENS}})
    first = window(story).read_at
    rewrite_status_file(story, SESSION, HIGH_TOKENS)
    story.expect_rows(first is not None, window(story).read_at > first)


def test_a_status_file_the_program_has_not_rewritten_is_read_at_the_same_time(new_story):
    story = new_story(fixture=MainEnvironment)
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": HIGH_TOKENS}})
    first = window(story).read_at
    keep_status_file(story, SESSION)
    story.expect_rows(first is not None, window(story).read_at == first)


def test_a_missing_status_file_gives_a_window_with_no_reading_and_no_time(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_rows((window(story).used_percentage, window(story).total_input_tokens, window(story).read_at) == (None, None, None))


def test_b9_a_reading_rewritten_lower_is_read_as_the_new_number(new_story):
    story = new_story(fixture=MainEnvironment)
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": HIGH_TOKENS}})
    rewrite_status_file(story, SESSION, LOW_TOKENS)
    story.expect_rows(window(story).total_input_tokens == LOW_TOKENS)
