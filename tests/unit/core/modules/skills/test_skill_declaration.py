from core.base.skill.skill_declaration import SkillDeclaration


def test_a_skill_declares_its_folder_description_keywords_commands_and_events():
    skill = SkillDeclaration("journal-notes", "How to take notes", keywords=["note"], commands=["task list"], events=["task.*"])
    assert (skill.folder, skill.description, list(skill.keywords), list(skill.commands), list(skill.events)) == ("journal-notes", "How to take notes", ["note"], ["task list"], ["task.*"])


def test_a_skill_needs_only_a_folder_and_a_description():
    skill = SkillDeclaration("journal-notes", "How to take notes")
    assert (list(skill.keywords), list(skill.commands), list(skill.events)) == ([], [], [])
