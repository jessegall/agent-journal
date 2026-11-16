# @sin architecture_drivers_stack_imports_the_machine
from engine.agent_machine.agent_view import AgentView
# @righteous architecture_drivers_stack_imports_the_machine
from engine.agent_stack.reason import Reason
# @righteous architecture_drivers_state_defined_outside_the_stack
from engine.agent_stack.states.state import State


class Reviewing(State):
    def stop_answer(self, work_stop):
        return Reason, AgentView
