import re

from core.modules.skills.commands.require_skill import RequireSkill


class ListenerSample:
    def handle(self, event, call, text_keywords):
        # @sin architecture_skills_KeywordMatchInOnePlaceDetector
        matches = re.findall("[a-z]+", call.summary)
        # @sin architecture_skills_SkillFilesOnlyInSkillFilesDetector
        location = ".claude/skills/journal-notes/SKILL.md"
        # @righteous architecture_skills_SkillsDueByListenersDetector
        self.run(event, RequireSkill(call.agent_id, "journal-notes"))
        # @righteous architecture_skills_KeywordMatchInOnePlaceDetector
        self.keep(matches, location)
        return text_keywords(call.summary)
