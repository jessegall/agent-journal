from datetime import timedelta
from uuid import uuid4

from core.base.driver import driver_rules
from core.base.driver.driver_rules import DriverRules
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_route import HookRoute
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted


class SessionMain(StoryFixture):
    """The main agent started its session s-1."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.hook("s-1", HookSamples.session_start())


def slow_first_rule(monkeypatch) -> list[str]:
    """Makes the first rule asked on each hook take nine seconds and the others a tenth, and gives the first rule's name."""
    clock = {"now": 0.0}
    slow: list[str] = []
    monkeypatch.setattr(driver_rules, "perf_counter", lambda: clock["now"])
    original = DriverRules.rule_outcome

    def timed(self, entry, hook):
        if not slow:
            slow.append(entry.name)
        clock["now"] += 9.0 if entry.name == slow[0] else 0.1
        return original(self, entry, hook)

    monkeypatch.setattr(DriverRules, "rule_outcome", timed)
    return slow


def late_hook(story: Story, seconds: int) -> None:
    """A prompt hook that fired this many seconds before the journal answered it."""
    fired = int((story.clock.timestamp().value.timestamp() - seconds) * 1000)
    event = HookEvent.parsed(HookSamples.prompt("go on").with_fields(session="s-1", firing=f"story-{uuid4().hex}", fired_at_ms=fired).body)
    with story.repeated_work.request():
        story.container.get(HookRoute).answer(event)


def test_three_hook_timeouts_in_ten_minutes_tell_the_main_agent_once_with_the_agent_and_the_slowest_rule(new_story, monkeypatch):
    story = new_story(fixture=SessionMain)
    slow = slow_first_rule(monkeypatch)
    for _ in range(3):
        late_hook(story, 6)
        story.advance(timedelta(seconds=30))
    reply = story.hook("s-1", HookSamples.prompt("and on"))
    notified = [line for line in reply.lines if "hook timeouts" in line]
    story.expect_rows(len(notified) == 1, f"agent {story.agent.id} had 3 hook timeouts" in notified[0], slow[0] not in notified[0], detail=str(notified))
    story.expect_text("chat-mark list --environment main", slow[0], actor=story.user)
    late_hook(story, 6)
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "hook timeouts")


def test_the_persons_chat_shows_the_same_once(new_story, monkeypatch):
    story = new_story(fixture=SessionMain)
    slow = slow_first_rule(monkeypatch)
    for _ in range(4):
        late_hook(story, 6)
    story.run_listeners()
    marks = marks_text(story)
    story.expect_rows(marks.count("hook timeouts in ten minutes") == 1, slow[0] in marks, detail=marks)


def test_two_timeouts_or_timeouts_far_apart_tell_nothing(new_story):
    story = new_story(fixture=SessionMain)
    late_hook(story, 6)
    late_hook(story, 6)
    story.advance(timedelta(minutes=11))
    late_hook(story, 6)
    story.expect_absent_hook_line("s-1", HookSamples.prompt("go on"), "hook timeouts")


def test_a_hook_answered_in_time_is_no_timeout(new_story):
    story = new_story(fixture=SessionMain)
    for _ in range(4):
        late_hook(story, 2)
    story.expect_absent_hook_line("s-1", HookSamples.prompt("go on"), "hook timeouts")
