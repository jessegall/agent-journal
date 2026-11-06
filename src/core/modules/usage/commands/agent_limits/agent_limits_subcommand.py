from argparse import Namespace
from dataclasses import asdict

from core.base.caller.caller import Caller
from core.base.profile.agent_profile import AgentProfile
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_type_limits import AgentTypeLimits
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.usage.support.agent_limit_counts import AgentLimitCounts, AgentProfileLimitCounts


class AgentLimitsSubcommand(ReadSubcommand[tuple[AgentLimitCounts, ...]]):
    """Reads agent counts and the limits in force for each registered type and its kept profiles."""

    cli_name = "agent"
    name = "limits"
    environment_refusal = "agent limits are shown for one environment"

    def __init__(self, queries: Queries, registry: Registry, limits: AgentTypeLimits, profiles: ProfileFiles) -> None:
        self.queries, self.registry, self.limits, self.profiles = queries, registry, limits, profiles

    def read(self, arguments: Namespace, caller: Caller) -> tuple[AgentLimitCounts, ...]:
        kept = tuple(self.queries.query(Agent).matching(IsNull("retired_at")).all_rows())
        titles = {profile.name: profile.display_title for profile in self.profiles.listed() if isinstance(profile, AgentProfile)}
        counts = []
        for entry in self.registry.agent_types:
            if not entry.run_limit_key:
                continue
            agents = tuple(agent for agent in kept if agent.role == entry.key)
            limits = self.limits.for_type(entry)
            profiles = []
            for profile in sorted({agent.profile for agent in agents if agent.profile and entry.profile_limits_key}):
                matching = tuple(agent for agent in agents if agent.profile == profile)
                profile_limits = self.limits.for_type(entry, profile)
                profiles.append(AgentProfileLimitCounts(profile, titles.get(profile, profile), sum(agent.ended_at is None for agent in matching), len(matching), profile_limits.run, profile_limits.kept))
            counts.append(AgentLimitCounts(entry.key, entry.label, sum(agent.ended_at is None for agent in agents), len(agents), limits.run, limits.kept,
                                          entry.run_limit_key, entry.kept_limit_key, bool(entry.profile_limits_key), tuple(profiles)))
        return tuple(counts)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, tuple):
            lines = [f"{row.label}: {row.running} running, {row.kept} kept; limits{' per profile' if row.per_profile else ''}: running {row.run_limit}, kept {'no limit' if row.kept_limit == 0 else row.kept_limit}" for row in value]
            output.write("\n".join(lines), {"rows": [asdict(row) for row in value]})
