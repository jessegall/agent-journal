import shutil
from collections.abc import Callable

from engine.testing.stories.story import Story

SKILLS_FOLDER = ".claude/skills"
REMOVED_SKILL = "journal-notes"


def is_skill_restored(story: Story, rewrite: Callable[[Story], None]) -> bool:
    skill = story.home.project_folder / SKILLS_FOLDER / REMOVED_SKILL
    shutil.rmtree(skill)
    rewrite(story)
    return (skill / "SKILL.md").is_file()
