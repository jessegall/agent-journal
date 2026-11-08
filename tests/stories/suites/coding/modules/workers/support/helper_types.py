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



class RuleForEveryHelper(StoryFixture):
    """A module adds a rule that names the helper role; a worker, a read-only helper and a clerk are each started."""

    parent = OrchestratorWithOpenTask

    def steps(self, story: Story) -> None:
        story.expect_sync_success("tests.stories.core.base.module.support.agent_type_modules:EveryHelperRules")
        for role in ("helper", "worker", "clerk"):
            story.expect_success(f"agent start s-{role} claude {role} --parent {story.agent.id} --environment main")


class RuleForReadOnlyHelpers(StoryFixture):
    """A module adds a rule for read-only helpers alone; a worker and a read-only helper are started."""

    parent = OrchestratorWithOpenTask

    def steps(self, story: Story) -> None:
        story.expect_sync_success("tests.stories.core.base.module.support.agent_type_modules:ReadOnlyHelperRules")
        for role in ("helper", "worker"):
            story.expect_success(f"agent start s-{role} claude {role} --parent {story.agent.id} --environment main")
