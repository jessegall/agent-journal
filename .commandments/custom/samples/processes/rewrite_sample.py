from core.base.driver.rule_answer import RuleAnswer


def other_rule_rewrites():
    # @sin architecture_processes_OnlyRunnerRewritesShellDetector
    return RuleAnswer.rewritten({"command": "sample"})


def other_rule_answers():
    # @righteous architecture_processes_OnlyRunnerRewritesShellDetector
    return RuleAnswer.with_lines("a line")
