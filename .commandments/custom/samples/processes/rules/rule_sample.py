import subprocess

from core.base.driver.rule_answer import RuleAnswer


class SampleRule:
    def answer(self, hook):
        # @sin architecture_processes_RulesNeverRunDetector
        subprocess.run(["ls"], check=False)
        # @sin architecture_processes_RulesNeverRunDetector
        self.repository.save(hook)
        # @righteous architecture_processes_RulesNeverRunDetector
        return RuleAnswer.allowed().running(hook)
