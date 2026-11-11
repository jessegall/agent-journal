from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_program_list import AgentProgramList
from core.modules.drivers.models.context_compaction import ContextCompaction
from core.modules.usage.support.agent_facts import AgentFacts
from core.modules.usage.support.agent_inspection import AgentInspection
from core.modules.usage.support.tool_facts import ToolFacts


@dataclass(frozen=True)
class AgentInspectorAnswer:
    """All that an agent's inspector draws, in the one answer of its one read."""

    agent: Agent
    facts: AgentFacts | None
    inspection: AgentInspection
    tool: ToolFacts
    helpers: int
    skills: int
    points: Sequence[Mapping[str, object]]
    programs: AgentProgramList
    compaction: ContextCompaction | None
