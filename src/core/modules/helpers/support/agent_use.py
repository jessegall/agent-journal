from core.base.duration_unit import DurationUnit
from collections import defaultdict
from datetime import timedelta

from core.base.clock import Clock
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.agents.models.agent import MAIN_ROLE, Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.helper_settings import AGENT_USE_DAYS
from core.modules.helpers.support.model_use import ModelUse
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task

DAY_SECONDS = 86400
MAX_IDLE_AGENTS = 4


class AgentUse:
    """Counts the jobs of each type of agent by model over the last days, with the agents kept of it, so the main
    agent can decide what to retire; the journal retires nothing itself."""

    def __init__(self, queries: Queries, settings: SettingValues, clock: Clock) -> None:
        self.queries, self.settings, self.clock = queries, settings, clock

    def models(self) -> tuple[ModelUse, ...]:
        agents = tuple(agent for agent in self.queries.query(Agent).all_rows() if agent.role != MAIN_ROLE)
        job_counts = self.job_counts()
        agent_types = {agent.id: (agent.profile or agent.role, agent.program_model or "default") for agent in agents}
        jobs: dict[tuple[str, str], int] = defaultdict(int)
        unretired_agents: dict[tuple[str, str], list[Agent]] = defaultdict(list)
        for agent in agents:
            jobs[agent_types[agent.id]] += job_counts[agent.id]
            if agent.retired_at is None:
                unretired_agents[agent_types[agent.id]].append(agent)
        model_keys = sorted(key for key in {*jobs, *unretired_agents} if jobs[key] or unretired_agents[key])
        return tuple(ModelUse(agent_type, model, jobs[(agent_type, model)], tuple(unretired_agents[(agent_type, model)])) for agent_type, model in model_keys)

    def job_counts(self) -> dict[int, int]:
        oldest_created_at = (self.clock.timestamp().value - timedelta(days=self.settings.number(AGENT_USE_DAYS))).isoformat()
        counts: dict[int, int] = defaultdict(int)
        for job in self.queries.query(HelperJob).matching(Greater("created_at", oldest_created_at)).all_rows():
            if job.helper_id is not None:
                counts[job.helper_id] += 1
        for task in self.queries.query(Task).matching(Greater("created_at", oldest_created_at)).all_rows():
            if task.delegated_to is not None:
                counts[task.delegated_to] += 1
        return counts

    def retire_suggestion(self, agent_type: str) -> str:
        candidates = [model_use for model_use in self.models() if model_use.agent_type == agent_type and model_use.idle()]
        if not candidates:
            return ""
        selected = max(candidates, key=lambda model_use: model_use.job_agent_ratio)
        agent = selected.idle()[0]
        return (f"to make room: journal agent retire {agent.id} --reason \"<why>\": a {selected.model} agent idle for "
                f"{self.age(agent)}, and {selected.model} ran {selected.jobs} jobs with {len(selected.agents)} kept")

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
