from argparse import ArgumentParser, Namespace
from dataclasses import asdict

from engine.agent.agent_brief_points import AgentBriefPoints
from core.base.caller.caller import Caller
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.commands.agent_programs.agent_programs_subcommand import AgentProgramsSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.usage.commands.usage_agent.usage_agent_subcommand import UsageAgentSubcommand
from core.modules.usage.commands.usage_agents.usage_agents_subcommand import UsageAgentsSubcommand
from core.modules.usage.commands.usage_tool.usage_tool_subcommand import UsageToolSubcommand
from core.modules.usage.support.agent_inspector_answer import AgentInspectorAnswer
from core.modules.usage.support.tool_facts import ToolFacts


class UsageInspectorSubcommand(ReadSubcommand[AgentInspectorAnswer]):
    """`journal usage inspector <n>`: all that the inspector of agent n draws, in one read."""

    cli_name = "usage"
    name = "inspector"
    environment_refusal = "the agent is shown for one environment"

    def __init__(self, queries: Queries, inspection: UsageAgentSubcommand, facts: UsageAgentsSubcommand, tool: UsageToolSubcommand, programs: AgentProgramsSubcommand, points: AgentBriefPoints) -> None:
        self.queries, self.inspection, self.facts, self.tool, self.programs, self.points = queries, inspection, facts, tool, programs, points

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> AgentInspectorAnswer:
        agent = self.queries.query(Agent).find(arguments.agent_id)
        listed = self.facts.listing(True, agent.id, tuple([agent])).agents
        return AgentInspectorAnswer(agent, listed[0] if listed else None, self.inspection.read(Namespace(agent_id=agent.id), caller),
                                    ToolFacts() if agent.ended_at else self.tool.read(Namespace(agent=agent.id), caller),
                                    self.queries.query(Agent).filter(parent_id=agent.id).count(),
                                    self.queries.query(AgentSkill).filter(session_agent_id=agent.id, state=AgentSkillState.LOADED).count(),
                                    self.points.brief_points(agent.id), self.programs.read(Namespace(), caller))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentInspectorAnswer):
            output.write(f"agent {value.agent.id}, {value.helpers} helpers, {value.skills} skills loaded", {
                "agent": {**output.values(value.agent), **output.properties(value.agent)}, "facts": value.facts.json() if value.facts else None, "inspection": value.inspection.json(),
                "tool": asdict(value.tool), "helpers": value.helpers, "skills": value.skills, "points": list(value.points), "programs": value.programs.json()["rows"]})
