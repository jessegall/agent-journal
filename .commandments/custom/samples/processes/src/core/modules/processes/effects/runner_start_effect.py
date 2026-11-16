from engine.agent_machine.contracts.effect import Effect


class RunnerStartEffect(Effect):
    # @righteous architecture_processes_shell_input_rewritten_outside_the_runner_effect
    def input_after(self, view, record, results):
        return {"command": "journal-run 4"}
