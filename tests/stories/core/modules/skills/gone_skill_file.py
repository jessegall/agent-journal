from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

RAISED = "failed and was passed by"


def test_a_skill_file_that_is_gone_while_the_catalogue_lists_it_raises_no_rule(new_story):
    story = new_story(fixture=BuilderStarted)
    folder = story.home.project_folder / ".agents/skills/journal-gone"
    folder.mkdir(parents=True)
    (folder / "SKILL.md").symlink_to(folder / "removed.md")
    reply = story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1))
    story.expect_rows(not [line for line in reply.lines if RAISED in line])
