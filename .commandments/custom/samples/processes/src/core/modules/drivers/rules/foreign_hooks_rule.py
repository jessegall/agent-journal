from engine.driver.project_hook_answer import ProjectHookAnswer
from engine.driver.rule_answer import RuleAnswer


def forwarded_input(answer: ProjectHookAnswer):
    # @righteous architecture_processes_shell_input_rewritten_outside_the_runner_rule
    return RuleAnswer(updated_input=answer.updated_input)


def built_shell_input():
    # @sin architecture_processes_shell_input_rewritten_outside_the_runner_rule
    return RuleAnswer.rewritten({"command": "sample"})
