from types import SimpleNamespace

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.line_source import LineSource
from core.modules.drivers.support.machine_assembly import MachineAssembly

TYPES = SimpleNamespace(behaviours=lambda role: SimpleNamespace(takes_prompts=role == "main"), read_access_keys=lambda: (), type_keys=lambda agent_type: (agent_type,))


class PromptLines(LineSource):
    role_group = RoleGroup.PROMPT


class MainLines(LineSource):
    agent_types = ["main"]


def test_a_contribution_holds_for_the_agent_types_it_names_and_its_role_group():
    assembly = MachineAssembly(SimpleNamespace(), SimpleNamespace(), TYPES)
    assert [assembly.covers(PromptLines, "main"), assembly.covers(PromptLines, "silent-helper")] == [True, False]
    assert [assembly.covers(MainLines, "main"), assembly.covers(MainLines, "worker")] == [True, False]
