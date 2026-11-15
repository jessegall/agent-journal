from engine.driver.rule_answer import RuleAnswer
from core.modules.skills.commands.require_skill.require_skill import RequireSkill


class RuleSample:
    def answer(self, bus, repository, hook, row):
        # @sin architecture_skills_skill_made_due_outside_the_skills_listeners
        command = RequireSkill(hook.agent_id, "journal-notes")
        bus.run(command, hook)
        repository.save(row)
        return RuleAnswer.refused("read journal-notes first")
