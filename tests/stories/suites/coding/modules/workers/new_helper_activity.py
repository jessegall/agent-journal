from datetime import timedelta

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_event import HookEvent
from core.modules.drivers.support.agent_activities import AgentActivities
from core.testing.hook_samples import HookSamples
from suites.coding.modules.workers.rules.inactive_helper_rule import InactiveHelperRule
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def test_the_inactive_helper_rule_run_right_after_a_dispatch_does_not_name_the_new_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.advance(timedelta(minutes=31))
    event = HookEvent.parsed(HookSamples.tick().with_fields(session="s-1", firing="check", fired_at_ms=0).body)
    hook = AgentHook(event=event, agent_id=story.agent.id, environment_id=1, role=AgentRole.MAIN, driver="coding.main", timestamp=story.clock.timestamp())
    story.container.get(AgentActivities).read(hook)
    worker = dispatched_worker(story)
    answer = story.container.get(InactiveHelperRule).warning(hook)
    story.expect_rows(worker.id > 0, answer.nudges == ())
