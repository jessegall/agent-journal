from core.modules.skills.commands.require_skill.require_skill import RequireSkill


class RuleSample:
    def answer(self, bus, repository, hook, row):
        # @sin architecture_skills_skill_made_due_outside_the_skills_listeners
        command = RequireSkill(question.agent_id, "journal-notes")
        bus.run(command, question)
        repository.save(row)
        return refused("read journal-notes first")


def refused(agent_message):
    return [agent_message]
