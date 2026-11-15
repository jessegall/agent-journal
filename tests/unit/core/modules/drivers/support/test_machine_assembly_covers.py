from types import SimpleNamespace

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.line_source import LineSource
from core.modules.drivers.support.machine_assembly import MachineAssembly

TYPES = SimpleNamespace(behaviours=lambda role: SimpleNamespace(takes_prompts=role == "main"), read_access_keys=lambda: ())


class PromptLines(LineSource):
    role_group = RoleGroup.PROMPT


class MainLines(LineSource):
    agent_types = ["main"]


def test_a_contribution_holds_for_the_agent_types_it_names_and_the_role_group_of_the_rule_it_replaces():
    assembly = MachineAssembly(SimpleNamespace(), SimpleNamespace(), TYPES)
    assert [assembly.covers(PromptLines, "main"), assembly.covers(PromptLines, "silent-helper")] == [True, False]
    assert [assembly.covers(MainLines, "main"), assembly.covers(MainLines, "worker")] == [True, False]
