from core.base.driver.foreign_answer import ForeignAnswer
from core.base.driver.rule_answer import RuleAnswer


def forwarded_input(answer: ForeignAnswer):
    # @righteous architecture_processes_OnlyRunnerRewritesShellDetector
    return RuleAnswer(updated_input=answer.updated_input)


def built_shell_input():
    # @sin architecture_processes_OnlyRunnerRewritesShellDetector
    return RuleAnswer.rewritten({"command": "sample"})
