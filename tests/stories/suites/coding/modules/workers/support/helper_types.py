from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from typing import ClassVar


class ClerkRegistered(StoryFixture):
    """Another module supplies a clerk type that extends helper."""

    parent = OrchestratorWithOpenTask

    def steps(self, story: Story) -> None:
        story.expect_sync_success("tests.stories.core.base.module.support.agent_type_modules:Clerk")


class HelperSession(StoryFixture):
    role: ClassVar[str]
    parent = ClerkRegistered

    def steps(self, story: Story) -> None:
        story.expect_success(f"agent start s-{self.role} claude {self.role} --parent {story.agent.id} --environment main")


class HelperStarted(HelperSession):
    role = "helper"


class WorkerStarted(HelperSession):
    role = "worker"


class NativeHelperUnderBuilder(HelperSession):
    role = "helper"


class ClerkStarted(HelperSession):
    role = "clerk"

