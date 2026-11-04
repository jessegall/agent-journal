from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.plans.support.approval_fixtures import ReadyApprovalPlan


class SendingTemplates(StoryFixture):
    parent = ReadyApprovalPlan

    def steps(self, story):
        story.expect_success('template make "Plan critique" --purpose critique --applies-to plan', actor=story.user)
        story.expect_success('template make "Plan outline" --applies-to plan', actor=story.user)
        story.expect_success('template make "Any row"', actor=story.user)
        story.expect_success('template make "Document critique" --purpose critique --applies-to doc', actor=story.user)
