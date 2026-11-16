from engine.agent_machine.contracts.effect import Effect


class WrappedLineEffect(Effect):
    # @sin architecture_processes_shell_input_rewritten_outside_the_runner_effect
    def input_after(self, view, record, results):
        return {"command": "sample"}
