from server.tick_round import TickRound
from tests.stories.core.base.drivers.support.fixtures import LeadLocked
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_a_tick_round_reaches_each_open_agents_rules_and_a_silenced_history_rule_keeps_its_history(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    TickRound(story.home).run()
    story.expect_text(f"rule-history list --agent {story.agent.id}", "samples.return-line", "silenced")
    story.expect_absent(f"hook-call list --agent {story.agent.id}", "tick")
