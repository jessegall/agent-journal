from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.questions.rules.own_question_tool_rule import OwnQuestionToolRule


class OwnQuestionToolPolicy(RulePolicy):
    """The refusal of OwnQuestionToolRule, with today's text, as a policy of the new driver."""

    rule = OwnQuestionToolRule
    rank = "questions.policies"
