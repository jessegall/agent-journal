from tests.stories.core.modules.skills.support.removed_skill import SKILLS_FOLDER, is_skill_restored
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import BuilderStarted

GOOD = f"{PATH}:GoodSkillsModule"


def test_a_publish_puts_back_every_declared_skill_and_removes_only_an_undeclared_one(new_story):
    story = new_story(GOOD, fixture=BuilderStarted)
    story.run("skill write")
    undeclared = story.home.project_folder / SKILLS_FOLDER / "journal-gone"
    undeclared.mkdir()
    (undeclared / "SKILL.md").write_text("---\nname: journal-gone\n---\n")
    story.expect_rows(is_skill_restored(story, lambda current: current.run("skill write")), not undeclared.exists())
