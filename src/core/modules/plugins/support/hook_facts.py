from functools import cached_property

from core.modules.plugins.support.agent_facts import AgentFacts
from core.modules.plugins.support.plugin_program import PluginProgram


class HookFacts:
    """The facts of the agent of one hook, read when first asked and kept for every plugin call of that hook."""

    def __init__(self, program: PluginProgram, agent_id: int | None) -> None:
        self.program, self.agent_id = program, agent_id

    @cached_property
    def value(self) -> AgentFacts:
        return self.program.facts(self.agent_id, None)
