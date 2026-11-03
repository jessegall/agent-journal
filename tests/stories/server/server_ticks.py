from core.base.module.module_finder import ModuleFinder
from core.modules.processes.ticks.output_reading import OutputReading
from server.ticker import Ticker
from tests.stories.core.base.driver.support.fixtures import LeadLocked
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.core.support.fixtures import UserJoined


def test_the_agent_ticks_of_the_ticker_reach_each_open_agents_rules_and_a_silenced_history_rule_keeps_its_history(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    agent_ticks = next(handler for handler in Ticker.module_handlers(ModuleFinder(story.home)) if handler.label == "agent ticks")
    ticker = Ticker(story.home, [agent_ticks], lambda: None, lambda: 0.0)
    ticker.tick()
    ticker.join(5.0)
    story.expect_text(f"rule-history list --agent {story.agent.id}", "samples.return-line", "silenced")
    story.expect_absent(f"hook-call list --agent {story.agent.id}", "tick")


def test_the_handlers_the_modules_declare_start_at_their_own_pace(new_story):
    story = new_story(fixture=UserJoined)
    intervals = {handler.label: (handler.interval.seconds, handler.starts_immediately) for handler in Ticker.module_handlers(ModuleFinder(story.home))}
    assert intervals["read running outputs"] == (1, False)
    assert intervals["agent ticks"] == (60, True)
    assert intervals["hook pruning"] == (24 * 60 * 60, True)
    assert intervals["phone notices"] == (60, True)


def test_a_slow_tick_says_so_in_the_chat_when_the_developer_option_is_on(new_story):
    story = new_story(fixture=BuilderWithUser)
    output_tick = OutputReading(iter([0.0, 0.4, 1.0, 1.4]).__next__)
    output_tick(story.container)
    assert "over its limit" not in story.run("message list --environment main").output_text
    story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
    story.expect_success("setting set journal.core.developer.tools.slow-clock-ticks true --project", actor=story.user)
    output_tick(story.container)
    assert "A tick of the journal's clock took 400 ms" in story.run("message list --environment main").output_text
