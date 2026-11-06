from collections import defaultdict
from datetime import timedelta

from core.base.clock import Clock
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.helper_settings import AGENT_USE_DAYS
from core.modules.helpers.support.model_use import ModelUse
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task

MAIN_ROLE = "main"
DAY_SECONDS = 86400
HOUR_SECONDS = 3600
IDLE_AGES_SHOWN = 4


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
        kept: dict[tuple[str, str], list[Agent]] = defaultdict(list)
        for agent in agents:
            jobs[agent_types[agent.id]] += job_counts[agent.id]
            if agent.retired_at is None:
                kept[agent_types[agent.id]].append(agent)
        used = sorted(key for key in {*jobs, *kept} if jobs[key] or kept[key])
        return tuple(ModelUse(agent_type, model, jobs[(agent_type, model)], tuple(kept[(agent_type, model)])) for agent_type, model in used)

    def job_counts(self) -> dict[int, int]:
        oldest_created_at = (self.clock.timestamp().value - timedelta(days=self.settings.number(AGENT_USE_DAYS))).isoformat()
        counts: dict[int, int] = defaultdict(int)
        for job in self.queries.query(HelperJob).matching(Greater("created_at", oldest_created_at)).all_rows():
            counts[job.helper_id] += 1
        for task in self.queries.query(Task).matching(Greater("created_at", oldest_created_at)).all_rows():
            counts[task.delegated_to] += 1
        return counts

    def retire_suggestion(self, agent_type: str) -> str:
        spare = [use for use in self.models() if use.agent_type == agent_type and use.idle()]
        if not spare:
            return ""
        most_spare = max(spare, key=lambda use: use.spare_share)
        agent = most_spare.idle()[0]
        return (f"to make room: journal agent retire {agent.id} --reason \"<why>\": a {most_spare.model} agent idle for "
                f"{self.age(agent)}, and {most_spare.model} ran {most_spare.jobs} jobs with {len(most_spare.kept)} kept")

    def age(self, agent: Agent) -> str:
        seconds = int(agent.ended_at.elapsed_seconds(self.clock.timestamp()))
        return f"{seconds // DAY_SECONDS}d" if seconds >= DAY_SECONDS else f"{seconds // HOUR_SECONDS}h"

    def report(self) -> str:
        models = self.models()
        if not models:
            return "no agents to count"
        days = self.settings.number(AGENT_USE_DAYS)
        lines = [f"jobs of the last {days} days, and the agents kept"]
        for use in models:
            idle = ", ".join(self.age(agent) for agent in use.idle()[:IDLE_AGES_SHOWN])
            lines.append(f"{use.agent_type}, {use.model}: jobs {use.jobs}, kept {len(use.kept)}" + (f", idle {idle}" if idle else ""))
        return "\n".join(lines)
