from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from tests.stories.core.modules.usage.support.status_files import keep_status_file, rewrite_status_file, save_status_file
from tests.stories.core.support.fixtures import MainEnvironment

SESSION = "s-status"
OLD_TOKENS = 1000
NEW_TOKENS = 2000


def tokens(story) -> int | None:
    return story.container.get(ClaudeCodeProvider).context_tokens(story.home, SESSION)


def status_path(story):
    return story.home.status_folder / f"{SESSION}.json"


def test_a_rewritten_status_file_shows_its_new_tokens(new_story):
    story = new_story(fixture=MainEnvironment)
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": OLD_TOKENS}})
    story.expect_rows(tokens(story) == OLD_TOKENS)
    rewrite_status_file(story, SESSION, NEW_TOKENS)
    story.expect_rows(tokens(story) == NEW_TOKENS)


def test_a_status_file_the_program_has_not_rewritten_keeps_its_old_tokens(new_story):
    story = new_story(fixture=MainEnvironment)
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": OLD_TOKENS}})
    modified_ns = status_path(story).stat().st_mtime_ns
    keep_status_file(story, SESSION)
    story.expect_rows(tokens(story) == OLD_TOKENS, status_path(story).stat().st_mtime_ns == modified_ns)


def test_each_rewrite_is_modified_later_than_the_one_before(new_story):
    story = new_story(fixture=MainEnvironment)
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": OLD_TOKENS}})
    first_ns = status_path(story).stat().st_mtime_ns
    rewrite_status_file(story, SESSION, NEW_TOKENS)
    second_ns = status_path(story).stat().st_mtime_ns
    rewrite_status_file(story, SESSION, OLD_TOKENS)
    story.expect_rows(first_ns < second_ns < status_path(story).stat().st_mtime_ns, tokens(story) == OLD_TOKENS)
