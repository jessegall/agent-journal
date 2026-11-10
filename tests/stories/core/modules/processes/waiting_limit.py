from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value

LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
FULL_LIMIT_SECONDS = 15


def newest_limit(story) -> int:
    return story.container.get(Queries).query(Process).newest().first().limit_seconds


def test_a_worker_keeps_the_full_limit_while_a_message_waits_and_the_main_agent_gets_the_shorter_one(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.new_row_id("agent start s-9 claude worker --environment main")
    story.hook("s-9", HookSamples.session_start())
    story.run('message send "Are you there" --environment main', actor=story.user)
    story.hook("s-9", LISTING)
    expect_value(newest_limit(story), FULL_LIMIT_SECONDS)
    story.hook("s-1", LISTING)
    story.expect_rows(newest_limit(story) < FULL_LIMIT_SECONDS)
