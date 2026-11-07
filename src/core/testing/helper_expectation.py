from core.testing.story import Story


class HelperExpectation:
    """What a fixture with story.helper under story.agent must hold: the helper's row names its parent."""

    def expect(self, story: Story) -> None:
        story.expect_success(f"agent show {story.helper.id}", "role: helper", f"parent_id: {story.agent.id}")
