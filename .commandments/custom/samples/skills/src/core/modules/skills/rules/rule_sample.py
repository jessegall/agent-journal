from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.commands.require_skill import RequireSkill


class RuleSample:
    def answer(self, bus, repository, hook, row):
        # @sin architecture_skills_SkillsDueByListenersDetector
        command = RequireSkill(hook.agent_id, "journal-notes")
        # @sin architecture_skills_RulesOnlyRefuseDetector
        bus.run(command, hook)
        # @sin architecture_skills_RulesOnlyRefuseDetector
        repository.save(row)
        # @righteous architecture_skills_RulesOnlyRefuseDetector
        return RuleAnswer.refused("read journal-notes first")
