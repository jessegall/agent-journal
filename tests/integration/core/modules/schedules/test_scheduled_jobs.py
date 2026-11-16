from engine.testing.stories.story_fixture import StoryFixture

from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.registry.registry import Registry
from engine.registry.suite_windows import SuiteWindows
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

JOB = "1a2b3c4d"
CRON = "*/10 * * * *"


def cron_hook(tool: str, fields: dict, answer: str = ""):
    return HookSamples.sample("post_tool_use", {"name": tool, "category": "other", "files": [], "diff": None}).with_raw({"tool_input": fields, "tool_response": answer})


class ScheduledBuildJob(StoryFixture):
    parent = BuilderStarted
    recurring = True

    def steps(self, story):
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
        story.hook('s-1', cron_hook('CronCreate', {'cron': CRON, 'prompt': 'Check the build\nand say', 'recurring': self.recurring}, f'Scheduled job {JOB}, next run soon'))


class OneTimeBuildJob(ScheduledBuildJob):
    recurring = False


def running(story) -> str:
    return f"scheduled-job running --agent {story.agent.id}"
















def test_the_agent_bars_windows_are_offered_by_the_coding_suite(played):
    story = played(BuilderStarted)
    windows = {window.name for window in SuiteWindows(story.container.get(Registry)).windows("coding")}
    story.expect_rows({"schedules.jobs", "workers.workers"} <= windows)




