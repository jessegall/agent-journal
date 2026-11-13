from argparse import Namespace
from dataclasses import asdict

from engine.caller.caller import Caller
from engine.agent.work.agent_work import AgentWork
from engine.profile.agent_profile import AgentProfile
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.registry.registry import Registry
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.agents.models.agent import Agent
from core.modules.usage.models.agent_counts import AgentCounts
from core.modules.usage.support.agent_type_limits import AgentTypeLimits
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.usage.support.agent_limit_counts import AgentLimitCounts
from core.modules.usage.support.agent_profile_limit_counts import AgentProfileLimitCounts
from core.modules.settings.support.setting_reader import SettingReader

PENDING_AGENTS_REASON = "every agent with pending work counts against its limit"


class AgentLimitsSubcommand(ReadSubcommand[tuple[AgentLimitCounts, ...]]):
    """Reads agent counts and the limits in force for each registered type and its kept profiles."""

    cli_name = "agent"
    name = "limits"
    environment_refusal = "agent limits are shown for one environment"

    def __init__(self, queries: Queries, registry: Registry, limits: AgentTypeLimits, profiles: ProfileFiles, settings: SettingReader, work: AgentWork) -> None:
        self.work = work
        self.queries, self.registry, self.limits, self.profiles = queries, registry, limits, profiles
        self.settings = settings

    def read(self, arguments: Namespace, caller: Caller) -> tuple[AgentLimitCounts, ...]:
        kept = tuple(self.queries.query(AgentCounts).get())
        pending_ids = tuple(self.work.pending())
        pending = tuple(self.queries.query(Agent).matching(Among("id", pending_ids)).matching(IsNull("retired_at")).every_row(PENDING_AGENTS_REASON)) if pending_ids else ()
        installed_profiles = {profile.name: profile for profile in self.profiles.listed() if isinstance(profile, AgentProfile)}
        titles = {name: profile.display_title for name, profile in installed_profiles.items()}
        counts: list[AgentLimitCounts] = []
        for entry in self.registry.helper_types:
            if not entry.run_limit_key:
                continue
            agents = tuple(agent for agent in kept if agent.role == entry.key)
            extra = tuple(agent for agent in pending if agent.role == entry.key and agent.ended_at is not None)
            limits = self.limits.read(entry)
            profiles: list[AgentProfileLimitCounts] = []
            installed: set[str] = {name for name, profile in installed_profiles.items() if profile.agent_type == entry.key} if entry.profile_limits_key else set()
            for profile in sorted({agent.profile for agent in agents if agent.profile and entry.profile_limits_key} | installed):
                matching = tuple(agent for agent in agents if agent.profile == profile)
                profile_limits = self.limits.read(entry, profile)
                profiles.append(AgentProfileLimitCounts(profile, titles.get(profile, profile), sum(agent.running for agent in matching) + sum(agent.profile == profile for agent in extra), sum(agent.kept for agent in matching), profile_limits.run, profile_limits.kept, self.group_key(entry.key, profile), installed_profiles[profile].description if profile in installed_profiles else ""))
            counts.append(AgentLimitCounts(entry.key, entry.label, sum(agent.running for agent in agents) + len(extra), sum(agent.kept for agent in agents), limits.run, limits.kept,
                                          entry.run_limit_key, entry.kept_limit_key, bool(entry.profile_limits_key), tuple(profiles),
                                          self.settings.current(entry.run_limit_key).source, self.settings.current(entry.kept_limit_key).source, entry.line, entry.default_profile))
        return tuple(counts)

    def group_key(self, agent_type: str, profile: str) -> str:
        group = self.registry.agent_group_book().group(agent_type, profile)
        return group.key if group else ""

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            counts = [row for row in value if isinstance(row, AgentLimitCounts)]
            lines = [f"{row.label}: {row.running} running, {row.kept} kept; limits{' per profile' if row.profile_specific else ''}: running {row.run_limit}, kept {'no limit' if row.kept_limit == 0 else row.kept_limit}" for row in counts]
            rows = [asdict(row) for row in counts]
            for row in rows:
                row["per_profile"] = row.pop("profile_specific")
            output.write("\n".join(lines), {"rows": rows})
