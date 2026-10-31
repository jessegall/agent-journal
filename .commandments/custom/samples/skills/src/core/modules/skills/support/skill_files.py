class SkillFilesSample:
    """Keeps .claude/skills and SKILL.md in one place."""

    def path(self, folder):
        # @righteous architecture_skills_SkillFilesOnlyInSkillFilesDetector
        return f".claude/skills/{folder}/SKILL.md"
