import re

from core.modules.skills.commands.require_skill.require_skill import RequireSkill


# @sin architecture_layout_KindFoldersHoldTheirKindDetector
class ListenerSample:
    def handle(self, event, call, text_keywords):
        # @sin architecture_skills_KeywordMatchInOnePlaceDetector
        # @sin architecture_shell_NoHookCallSummaryCheckDetector
        matches = re.findall("[a-z]+", call.summary)
        # @sin architecture_skills_SkillFilesOnlyInSkillFilesDetector
        location = ".claude/skills/journal-notes/SKILL.md"
        # @righteous architecture_skills_SkillsDueByListenersDetector
        self.run(event, RequireSkill(call.agent_id, "journal-notes"))
        # @righteous architecture_skills_KeywordMatchInOnePlaceDetector
        self.keep(matches, location)
        # @sin architecture_shell_NoHookCallSummaryCheckDetector
        return text_keywords(call.summary)
