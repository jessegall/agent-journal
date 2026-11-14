import json

from engine.testing.stories.story import Story


class HelperExpectation:
    """What a fixture with story.helper under story.agent must hold: the helper's row names its parent."""

    def expect(self, story: Story) -> None:
        rows = json.loads(story.run("agent list --json", actor=story.agent).output_text)["rows"]
        helpers = [row for row in rows if row["id"] == story.helper.id]
        story.expect_rows([(row["role"], row["parent_id"]) for row in helpers] == [("helper", story.agent.id)], detail=str(helpers))
