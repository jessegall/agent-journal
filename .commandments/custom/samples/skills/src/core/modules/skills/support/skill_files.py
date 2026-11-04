class SkillFilesSample:
    """Keeps .claude/skills and SKILL.md in one place."""

    def path(self, folder):
        # @righteous architecture_skills_skill_path_outside_skill_files
        return f".claude/skills/{folder}/SKILL.md"
