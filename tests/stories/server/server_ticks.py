from datetime import timedelta

from core.base.driver.hook_route import HookRoute
from server.journal_round import JournalRound
from server.tick_work import TickWork
from tests.stories.core.base.driver.support.fixtures import LeadLocked
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderWithUser


def test_a_tick_round_reaches_each_open_agents_rules_and_a_silenced_history_rule_keeps_its_history(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    JournalRound(story.home, "ticker", TickWork(lambda: None)).run()
    story.expect_text(f"rule-history list --agent {story.agent.id}", "samples.return-line", "silenced")
    story.expect_absent(f"hook-call list --agent {story.agent.id}", "tick")


def test_a_fault_in_reading_the_outputs_does_not_stop_the_minute_work(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    work, ticks = TickWork(lambda: None), []
    route = story.container.get(HookRoute)
    route.answer = lambda event: ticks.append(event)

    def broken(_container) -> None:
        raise ValueError("a bad output")

    monkeypatch.setattr(work, "read_running_outputs", broken)
    work.run(story.container)
    assert ticks


def test_the_minute_work_waits_for_the_minute_while_the_clock_ticks(new_story):
    story = new_story(fixture=BuilderStarted)
    work, ticks = TickWork(lambda: None), []
    route = story.container.get(HookRoute)
    original = route.answer
    route.answer = lambda event: (ticks.append(event), original(event))[1]
    work.run(story.container)
    first = len(ticks)
    work.run(story.container)
    assert first > 0 and len(ticks) == first
    story.advance(timedelta(seconds=61))
    work.run(story.container)
    assert len(ticks) > first


def test_a_slow_tick_says_so_in_the_chat_when_the_developer_option_is_on(new_story):
    story = new_story(fixture=BuilderWithUser)
    work = TickWork(lambda: None, iter([0.0, 0.4, 1.0, 1.4]).__next__)
    work.run(story.container)
    assert "over its limit" not in story.run("message list --environment main").output_text
    story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
    story.expect_success("setting set journal.core.developer.tools.slow-clock-ticks true --project", actor=story.user)
    work.run(story.container)
    assert "A tick of the journal's clock took 400 ms" in story.run("message list --environment main").output_text
