from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.commands.require_skill.require_skill import RequireSkill


# @sin architecture_layout_helper_in_a_kind_folder
class RuleSample:
    def answer(self, bus, repository, hook, row):
        # @sin architecture_skills_skill_made_due_outside_the_skills_listeners
        command = RequireSkill(hook.agent_id, "journal-notes")
        # @sin architecture_skills_skill_rule_acts
        bus.run(command, hook)
        # @sin architecture_skills_skill_rule_acts
        repository.save(row)
        # @righteous architecture_skills_skill_rule_acts
        # @sin architecture_nudges_raw_line_from_a_rule
        return RuleAnswer.refused("read journal-notes first")
