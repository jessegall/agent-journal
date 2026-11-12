from engine.enums.duration_unit import DurationUnit
from collections import defaultdict
from datetime import timedelta

from engine.time.clock import Clock
from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.agents.models.agent import MAIN_ROLE, Agent
from core.modules.helpers.queries.agent_job_counts import AgentJobCounts
from core.modules.helpers.support.helper_settings import AGENT_USE_DAYS
from core.modules.helpers.support.model_use import ModelUse
from engine.setting.setting_values import SettingValues

DAY_SECONDS = 86400
MAX_IDLE_AGENTS = 4
KEPT_AGENTS_REASON = "The helpers of every type that are not retired, which the kept limit of each agent type bounds."


class AgentUse:
    """Counts the jobs of each type of agent by model over the last days, with the agents kept of it, so a person
    can decide what to retire; the journal retires nothing itself."""

    def __init__(self, queries: Queries, settings: SettingValues, clock: Clock, job_counts: AgentJobCounts) -> None:
        self.queries, self.settings, self.clock, self.job_counts = queries, settings, clock, job_counts

    def models(self) -> tuple[ModelUse, ...]:
        oldest_created_at = (self.clock.timestamp().value - timedelta(days=self.settings.number(AGENT_USE_DAYS))).isoformat()
        jobs = self.job_counts.counted_after(oldest_created_at)
        unretired_agents: dict[tuple[str, str], list[Agent]] = defaultdict(list)
        for agent in self.queries.query(Agent).matching(IsNull("retired_at")).matching(Excluding(Equal("role", MAIN_ROLE))).every_row(KEPT_AGENTS_REASON):
            unretired_agents[agent.use_key].append(agent)
        model_keys = sorted(key for key in {*jobs, *unretired_agents} if jobs[key] or unretired_agents[key])
        return tuple(ModelUse(agent_type, model, jobs[(agent_type, model)], tuple(unretired_agents[(agent_type, model)])) for agent_type, model in model_keys)

    def age(self, agent: Agent) -> str:
        seconds = int(agent.ended_timestamp().elapsed_seconds(self.clock.timestamp()))
        return f"{seconds // DAY_SECONDS}d" if seconds >= DAY_SECONDS else f"{seconds // DurationUnit.HOUR.seconds}h"

    def report(self) -> str:
        models = self.models()
        if not models:
            return "no agents to count"
        days = self.settings.number(AGENT_USE_DAYS)
        lines = [f"jobs of the last {days} days, and the agents kept"]
        for model_use in models:
            idle_ages = ", ".join(self.age(agent) for agent in model_use.idle()[:MAX_IDLE_AGENTS])
            lines.append(f"{model_use.agent_type}, {model_use.model}: jobs {model_use.jobs}, kept {len(model_use.agents)}" + (f", idle {idle_ages}" if idle_ages else ""))
        return "\n".join(lines)
