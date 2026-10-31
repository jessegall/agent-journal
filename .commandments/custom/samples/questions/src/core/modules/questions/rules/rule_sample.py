from core.base.driver.rule_answer import RuleAnswer


# @sin architecture_layout_KindFoldersHoldTheirKindDetector
class RuleSample:
    def answer(self, bus, repository, command, question):
        # @sin architecture_questions_RulesNeverAskDetector
        bus.run(command, question)
        # @sin architecture_questions_RulesNeverAskDetector
        repository.save(question)
        # @righteous architecture_questions_RulesNeverAskDetector
        return RuleAnswer.with_lines("question 1 is answered")
