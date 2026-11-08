from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.agent_policy import AgentPolicy
import json
from argparse import ArgumentParser, Namespace

from core.base.agent_sandbox_choice import AgentSandboxChoice
from core.base.caller.caller import Caller
from core.base.clock import Clock
from core.base.query.conditions.excluding import Excluding
from core.modules.usage.conditions.agent_activity import AgentActivity
from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.support.driver_settings import BLOCK_CARD_SECONDS
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.profile.agent_profile import AgentProfile
from core.modules.usage.models.agent_card import AgentCard
from core.modules.usage.support.agent_blocked import AgentBlocked
from core.modules.usage.support.agent_facts import AgentFacts
from core.modules.usage.support.agent_facts_list import AgentFactsList
from core.modules.usage.support.session_status import SessionStatus
from core.modules.usage.support.status_files import StatusFiles

CLOSED_AGENTS_SHOWN = 50
BLOCKED_STATE = "blocked"
WAITING_STATE = "waiting"
USAGE_LIMIT_STATE = "at usage limit"


class UsageAgentsSubcommand(ReadSubcommand[AgentFactsList]):
    """`journal usage agents [--environment <name>]`: for each agent still running, its model, context, cost
    and the task it works on."""

    cli_name = "usage"
    name = "agents"
    environment_refusal = "the agents are shown for one environment"

    def __init__(self, queries: Queries, files: StatusFiles, providers: Providers, home: JournalHome, suites: SuiteChoice, profiles: ProfileFiles, settings: SettingValues, clock: Clock, activity: AgentActivity, sandbox: AgentSandboxChoice) -> None:
        self.activity, self.sandbox = activity, sandbox
        self.queries, self.files, self.providers, self.home, self.suites, self.profiles = queries, files, providers, home, suites, profiles
        self.settings, self.clock = settings, clock

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--closed", action="store_true", help="also the agents that ended most recently")
        parser.add_argument("--agent", type=int, dest="agent_id", help="show only this agent")

    def read(self, arguments: Namespace, caller: Caller) -> AgentFactsList:
        cards = self.queries.query(AgentCard)
        if arguments.agent_id is not None:
            cards = cards.filter(id=arguments.agent_id)
        activity = self.activity.current()
        running = tuple(cards.matching(activity).oldest().all_rows())
        ended = tuple(cards.matching(Greater("ended_at", "")).matching(Excluding(activity)).newest().page(1, CLOSED_AGENTS_SHOWN).rows) if arguments.closed else ()
        pending = activity.pending
        policy = self.suites.agent_policy()
        titles = {profile.name: profile.display_title for profile in self.profiles.listed() if isinstance(profile, AgentProfile)}
        return AgentFactsList(tuple(self.facts(card, policy, titles, pending.get(card.id)) for card in (*running, *ended)))

    def facts(self, card: AgentCard, policy: AgentPolicy, titles: dict[str, str], work_status: str | None = None) -> AgentFacts:
        blocked_reason = AgentBlocked(self.settings.number(BLOCK_CARD_SECONDS)).reason(card, self.clock.timestamp(), policy)
        status = self.files.status(card.session)
        return AgentFacts(card.id, status.model or self.reported_model(card) or card.program_model or card.job_model, self.context_percent(card, status), status.cost_dollars, card.started_task_id, card.started_task_title,
                          tuple(json.loads(card.tasks)), self.waiting_state(card, blocked_reason), card.profile or card.job_profile, card.given_name or card.job_description.split(",", 1)[0],
                          card.job_instruction, status.effort or self.session_effort(card), card.role in policy.job_roles, card.job_returned, card.last_activity, self.helper_job(card), titles.get(card.profile or card.job_profile, card.profile or card.job_profile), blocked_reason, work_status, not self.sandbox.sandboxed(card.id), card.limited_until.text if card.limited_until is not None else None)

    @staticmethod
    def helper_job(card: AgentCard) -> str:
        description = card.helper_job_description.strip()
        if description and description not in (card.given_name, card.profile, card.job_profile):
            return description[:100]
        return next((line.strip()[:100] for line in card.helper_job_brief.splitlines() if line.strip()), "")

    def context_percent(self, card: AgentCard, status: SessionStatus) -> int | None:
        if status.context_percent is not None or status.is_reported:
            return status.context_percent
        return self.providers.context_percent(card.program, self.home, card.session)

    def reported_model(self, card: AgentCard) -> str:
        return self.providers.reported_model(card.program, self.home, card.session)

    def session_effort(self, card: AgentCard) -> str:
        return self.providers.session_effort(card.program, self.home, card.session)

    @staticmethod
    def waiting_state(card: AgentCard, blocked_reason: str) -> str:
        if blocked_reason:
            return BLOCKED_STATE
        if card.limited_until is not None:
            return USAGE_LIMIT_STATE
        return WAITING_STATE if card.paused_at is not None else ""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentFactsList):
            output.write(value.line(), {"rows": [facts.json() for facts in value.agents]})
