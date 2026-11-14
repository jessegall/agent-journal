from engine.driver.rule_answer import RuleAnswer


# @sin architecture_layout_helper_in_a_kind_folder
class RuleSample:
    def answer(self, bus, repository, command, question):
        # @sin architecture_questions_question_rule_acts
        bus.run(command, question)
        # @sin architecture_questions_question_rule_acts
        repository.save(question)
        # @righteous architecture_questions_question_rule_acts
        return RuleAnswer.with_lines("question 1 is answered")
