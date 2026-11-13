import shutil

from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import BuilderStarted

GOOD = f"{PATH}:GoodSkillsModule"
SKILLS = ".claude/skills"


def test_a_publish_puts_back_every_declared_skill_and_removes_only_an_undeclared_one(new_story):
    story = new_story(GOOD, fixture=BuilderStarted)
    story.run("skill write")
    skills = story.home.project_folder / SKILLS
    shutil.rmtree(skills / "journal-notes")
    (skills / "journal-gone").mkdir()
    (skills / "journal-gone" / "SKILL.md").write_text("---\nname: journal-gone\n---\n")
    story.run("skill write")
    story.expect_rows((skills / "journal-notes" / "SKILL.md").is_file(), not (skills / "journal-gone").exists())
