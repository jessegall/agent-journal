from unittest.mock import Mock

from core.base.leftover_process import LeftoverProcess
from core.modules.agents.support.agent_program import AgentProgram


def test_a_reused_pid_does_not_stop_the_new_programs_children(monkeypatch):
    table = Mock()
    stopped = Mock()
    monkeypatch.setattr(LeftoverProcess, 'command_line', lambda pid: 'different-program')
    monkeypatch.setattr(LeftoverProcess, 'stop', stopped)
    program = AgentProgram(Mock(), Mock(), table)
    assert program.stop_tree(123, 'claude')
    table.rows.assert_not_called()
    stopped.assert_not_called()
