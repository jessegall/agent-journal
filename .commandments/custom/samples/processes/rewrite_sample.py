from core.base.driver.rule_answer import RuleAnswer


def other_rule_rewrites():
    # @sin architecture_processes_OnlyRunnerRewritesShellDetector
    return RuleAnswer.rewritten({"command": "sample"})


def other_rule_answers():
    # @righteous architecture_processes_OnlyRunnerRewritesShellDetector
    return RuleAnswer.with_lines("a line")


def rewrite_after_commands_sample():
    # @sin architecture_processes_OnlyRunnerRewritesShellDetector
    return RuleAnswer.allowed().rewriting_after_commands(lambda values: {"command": "sample"})


def built_input_sample():
    # @sin architecture_processes_OnlyRunnerRewritesShellDetector
    return RuleAnswer(updated_input={"command": "sample"})
