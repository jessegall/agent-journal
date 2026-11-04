import re

from core.modules.skills.commands.require_skill.require_skill import RequireSkill


# @sin architecture_layout_helper_in_a_kind_folder
class ListenerSample:
    def handle(self, event, call, text_keywords):
        # @sin architecture_skills_keyword_matched_in_skills
        matches = re.findall("[a-z]+", call.summary)
        # @sin architecture_skills_skill_path_outside_skill_files
        location = ".claude/skills/journal-notes/SKILL.md"
        # @righteous architecture_skills_skill_made_due_outside_the_skills_listeners
        self.run(event, RequireSkill(call.agent_id, "journal-notes"))
        # @righteous architecture_skills_keyword_matched_in_skills
        self.keep(matches, location)
        return text_keywords(call.summary)
