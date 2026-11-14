from engine.command.context import Context
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE


def require_merger(agents: AgentRows, context: Context) -> Agent:
    agent = agents.find(context.actor.id)
    if agent.profile != MERGER_PROFILE:
        raise Refusal("only the merger runs this", "the main agent uses journal worker merge")
    return agent


def require_merging_agent(agents: AgentRows, context: Context) -> Agent:
    agent = agents.find(context.actor.id)
    if agent.profile != MERGER_PROFILE and not agents.is_main(agent.id):
        raise Refusal("only the merger or the main agent decides about a worktree behind its base")
    return agent
