from core.testing.story_fixture import StoryFixture

from core.modules.developer.support.hook_request_log import HookRequestLog
from tests.stories.core.support.coding_fixtures import BuilderWithUser

HEADERS = {"X-Journal-Hook-Id": "firing-1", "X-Journal-Env": "main"}


class HookRequestLogging(StoryFixture):
    parent = BuilderWithUser

    def steps(self, story):
        story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
        story.expect_success("setting set journal.core.developer.tools.hooks.request-log true --project", actor=story.user)


def logging_story(new_story, size: int = 3):
    story = new_story(fixture=HookRequestLogging)
    story.expect_success(f"setting set journal.core.developer.tools.hooks.request-log-size {size} --project", actor=story.user)
    return story


def test_nothing_is_recorded_while_the_option_is_off(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.container.get(HookRequestLog).record("claude", HEADERS, {"event": "stop"})
    story.expect_success("developer hook-requests", "nothing recorded yet")


def test_a_recorded_hook_keeps_its_headers_and_body(new_story):
    story = logging_story(new_story)
    story.container.get(HookRequestLog).record("claude", HEADERS, {"event": "stop"})
    row = story.container.get(HookRequestLog).read()[0]
    assert (row.program, row.headers, row.body) == ("claude", HEADERS, {"event": "stop"})


def test_only_the_last_hooks_the_setting_names_are_kept_newest_first(new_story):
    story = logging_story(new_story, size=2)
    log = story.container.get(HookRequestLog)
    for firing in ("first", "second", "third"):
        log.record("claude", HEADERS, {"firing": firing})
    assert [(row.number, row.body["firing"]) for row in log.read()] == [(3, "third"), (2, "second")]


def test_a_corrupt_log_file_costs_the_rows_and_not_the_hook(new_story):
    story = logging_story(new_story)
    log = story.container.get(HookRequestLog)
    log.path.parent.mkdir(parents=True, exist_ok=True)
    log.path.write_text("{not json")
    log.record("claude", HEADERS, {"event": "stop"})
    assert [row.number for row in log.read()] == [1]
