import subprocess

from engine.driver.rule_answer import RuleAnswer


class SampleRule:
    def answer(self, hook):
        # @sin architecture_processes_process_rule_runs_or_writes
        subprocess.run(["ls"], check=False)
        # @sin architecture_processes_process_rule_runs_or_writes
        self.repository.save(hook)
        # @righteous architecture_processes_process_rule_runs_or_writes
        return RuleAnswer.allowed().running(hook)
