from collections import defaultdict
from dataclasses import dataclass
from datetime import timedelta

from core.base.clock import Clock
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.helper_settings import AGENT_USE_DAYS
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task

MAIN_ROLE = "main"
SECONDS_IN_DAY = 86400
SECONDS_IN_HOUR = 3600
IDLE_AGES_SHOWN = 4


@dataclass(frozen=True)
class ModelUse:
    """How much one model of one kind of agent was used lately, and the agents of it that are kept."""

    kind: str
    model: str
    jobs: int
    kept: tuple[Agent, ...]

    def idle(self) -> tuple[Agent, ...]:
        return tuple(sorted((agent for agent in self.kept if agent.ended_at is not None), key=lambda agent: agent.ended_at.value))

    @property
    def spare_share(self) -> float:
        return len(self.kept) / max(self.jobs, 0.5)


class AgentUse:
    """Counts the jobs of each kind of agent by model over the last days, with the agents kept of it, so the main
    agent can decide what to retire; the journal retires nothing itself."""

    def __init__(self, queries: Queries, settings: SettingValues, clock: Clock) -> None:
        self.queries, self.settings, self.clock = queries, settings, clock

    def models(self) -> tuple[ModelUse, ...]:
        agents = tuple(agent for agent in self.queries.query(Agent).all_rows() if agent.role != MAIN_ROLE)
        job_counts = self.job_counts()
        kinds = {agent.id: (agent.profile or agent.role, agent.program_model or "default") for agent in agents}
        jobs: dict[tuple[str, str], int] = defaultdict(int)
        kept: dict[tuple[str, str], list[Agent]] = defaultdict(list)
        for agent in agents:
            jobs[kinds[agent.id]] += job_counts[agent.id]
            if agent.retired_at is None:
                kept[kinds[agent.id]].append(agent)
        used = sorted(key for key in {*jobs, *kept} if jobs[key] or kept[key])
        return tuple(ModelUse(kind, model, jobs[(kind, model)], tuple(kept[(kind, model)])) for kind, model in used)

    def job_counts(self) -> dict[int, int]:
        since = (self.clock.timestamp().value - timedelta(days=self.settings.number(AGENT_USE_DAYS))).isoformat()
        counts: dict[int, int] = defaultdict(int)
        for job in self.queries.query(HelperJob).matching(Greater("created_at", since)).all_rows():
            counts[job.helper_id] += 1
        for task in self.queries.query(Task).matching(Greater("created_at", since)).all_rows():
            counts[task.delegated_to] += 1
        return counts

    def retire_suggestion(self, kind: str) -> str:
        spare = [use for use in self.models() if use.kind == kind and use.idle()]
        if not spare:
            return ""
        most_spare = max(spare, key=lambda use: use.spare_share)
        agent = most_spare.idle()[0]
        return (f"to make room: journal agent retire {agent.id} --reason \"<why>\": a {most_spare.model} agent idle for "
                f"{self.age(agent)}, and {most_spare.model} ran {most_spare.jobs} jobs with {len(most_spare.kept)} kept")

    def age(self, agent: Agent) -> str:
        seconds = int(agent.ended_at.elapsed_seconds(self.clock.timestamp()))
        return f"{seconds // SECONDS_IN_DAY}d" if seconds >= SECONDS_IN_DAY else f"{seconds // SECONDS_IN_HOUR}h"

    def report(self) -> str:
        models = self.models()
        if not models:
            return "no agents to count"
        days = self.settings.number(AGENT_USE_DAYS)
        lines = [f"jobs of the last {days} days, and the agents kept"]
        for use in models:
            idle = ", ".join(self.age(agent) for agent in use.idle()[:IDLE_AGES_SHOWN])
            lines.append(f"{use.kind}, {use.model}: jobs {use.jobs}, kept {len(use.kept)}" + (f", idle {idle}" if idle else ""))
        return "\n".join(lines)
