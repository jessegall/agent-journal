from engine.caller.caller_request import SESSION_VARIABLE, CallerRequest
from engine.enums.execution_priority import ExecutionPriority


def test_a_command_from_an_agent_waits_as_an_agents_work():
    assert CallerRequest({SESSION_VARIABLE: "session-1"}).execution_priority is ExecutionPriority.AGENT


def test_a_command_from_a_persons_shell_goes_first():
    assert CallerRequest({}).execution_priority is ExecutionPriority.IMMEDIATE
