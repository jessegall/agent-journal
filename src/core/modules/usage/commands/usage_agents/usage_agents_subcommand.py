from core.modules.drivers.support.current_context_window import CurrentContextWindow
from engine.cli.agent_number import AgentNumber
from core.modules.agents.support.agent_rows import RUNNING_AGENTS_REASON
from core.modules.settings.bindings.support.context_caps import ContextCaps
from core.modules.settings.bindings.support.context_caps import ContextCaps
from core.modules.settings.bindings.support.context_share import ContextShare
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import NEW_SESSION_LAUNCH, RESUMED_SESSION_LAUNCH
from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.agent.agent_policy import AgentPolicy
import json
from collections.abc import Mapping, Sequence
from dataclasses import replace

from core.modules.usage.support.agent_spend import AgentSpend
from argparse import ArgumentParser, Namespace

from engine.sandbox.agent_sandbox_choice import AgentSandboxChoice
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.caller.caller import Caller
from engine.time.clock import Clock
from engine.agent.merged_work import MergedWork
from core.modules.tasks.models.enums.task_state import TaskState
from engine.query.conditions.excluding import Excluding
from core.modules.usage.conditions.agent_activity import AgentActivity
from engine.journal.journal_home import JournalHome
from engine.provider.context_window import ContextWindow
from engine.provider.providers import Providers
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.support.driver_settings import BLOCK_CARD_SECONDS
from core.modules.profiles.support.profile_files import ProfileFiles
from engine.setting.setting_values import SettingValues
from engine.profile.agent_profile import AgentProfile
from core.modules.usage.models.agent_card import AgentCard
from core.modules.usage.support.agent_blocked import AgentBlocked
from core.modules.usage.support.agent_facts import AgentFacts
from core.modules.usage.support.agent_facts_list import AgentFactsList
from core.modules.usage.support.plan_window import PlanWindow
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

    def __init__(self, queries: Queries, files: StatusFiles, providers: Providers, home: JournalHome, suites: SuiteChoice, profiles: ProfileFiles, settings: SettingValues, clock: Clock, activity: AgentActivity, sandbox: AgentSandboxChoice, types: HelperTypeBook, share: ContextShare, caps: ContextCaps, spend: AgentSpend, current_window: CurrentContextWindow) -> None:
        self.share, self.caps, self.spend, self.current_window = share, caps, spend, current_window
        self.activity, self.sandbox, self.types = activity, sandbox, types
        self.queries, self.files, self.providers, self.home, self.suites, self.profiles = queries, files, providers, home, suites, profiles
        self.settings, self.clock = settings, clock

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--closed", action="store_true", help="also the agents that ended most recently")
        parser.add_argument("--agent", type=AgentNumber, dest="agent_id", help="show only this agent")

    def read(self, arguments: Namespace, caller: Caller) -> AgentFactsList:
        return self.listing(arguments.closed, arguments.agent_id, ())

    def listing(self, closed: bool, agent_id: int | None, read_rows: Sequence[Agent]) -> AgentFactsList:
        cards = self.queries.query(AgentCard)
        if agent_id is not None:
            cards = cards.filter(id=agent_id)
        activity = self.activity.current()
        running = tuple(cards.matching(activity).oldest().full_table(RUNNING_AGENTS_REASON).all_rows())
        ended = tuple(cards.matching(Greater("ended_at", "")).matching(Excluding(activity)).newest().page(1, CLOSED_AGENTS_SHOWN).rows) if closed else ()
        pending = activity.pending
        policy = self.suites.agent_policy()
        titles = {profile.name: profile.display_title for profile in self.profiles.listed() if isinstance(profile, AgentProfile)}
        cards_read = (*running, *ended)
        statuses = self.statuses(cards_read)
        account = self.files.plan_windows(statuses)
        sandboxes = self.sandboxes(cards_read, read_rows)
        session_costs = self.spend.session_costs(agent_id) if agent_id is not None else ()
        unit_names = self.activity.work.unit_names([card.id for card in cards_read])
        merges = self.merged_work(cards_read)
        return AgentFactsList(tuple(replace(self.facts(card, policy, titles, pending.get(card.id), statuses[card.session], account, sandboxes.get(card.id, True), merges.get(card.id)), session_costs=session_costs,
                                            unit_name=unit_names.get(card.id, ""))
                                    for card in cards_read))

    def sandboxes(self, cards: Sequence[AgentCard], read_rows: Sequence[Agent]) -> dict[int, bool]:
        separate_folder_ids = {card.id for card in cards if self.types.find(card.role).separate_folder}
        rows = [row for row in read_rows if row.id in separate_folder_ids]
        unread = sorted(separate_folder_ids - {row.id for row in rows})
        return self.sandbox.sandboxed_among([*rows, *(self.queries.query(Agent).find_many(unread) if unread else ())])

    def merged_work(self, cards: Sequence[AgentCard]) -> Mapping[int, MergedWork]:
        return self.activity.work.merged_work([card.id for card in cards])

    @staticmethod
    def current_round(tasks: Sequence[Mapping[str, object]], merged: MergedWork | None) -> tuple[Mapping[str, object], ...]:
        if merged is None:
            return tuple(tasks)
        return tuple(task for task in tasks if task["state"] != TaskState.COMPLETED or not merged.includes(int(str(task["id"])), str(task["closed_at"])))

    def statuses(self, cards: Sequence[AgentCard]) -> Mapping[str, SessionStatus]:
        return {card.session: self.files.status(card.session) for card in cards}

    def facts(self, card: AgentCard, policy: AgentPolicy, titles: dict[str, str], work_status: str | None, status: SessionStatus, account: tuple[PlanWindow, ...], sandboxed: bool, merged: MergedWork | None) -> AgentFacts:
        blocked_reason = AgentBlocked(self.settings.number(BLOCK_CARD_SECONDS)).reason(card, self.clock.timestamp(), policy)
        return AgentFacts(card.id, status.model or self.reported_model(card) or card.program_model or card.job_model, self.context_percent(card, status), status.cost_dollars, card.started_task_id, card.started_task_title,
                          self.current_round(json.loads(card.tasks), merged), self.waiting_state(card, blocked_reason), card.profile or card.job_profile, card.given_name or card.job_description.split(",", 1)[0],
                          card.job_instruction, status.effort or self.session_effort(card), card.role in policy.job_roles, card.job_returned, card.last_activity, self.helper_job(card), card.helper_job_title, titles.get(card.profile or card.job_profile, card.profile or card.job_profile), blocked_reason, work_status, not sandboxed, status.windows or account, card.usage_limit_ends_at.text if card.usage_limit_ends_at is not None else None,
                          helper_job_program=card.helper_job_program, occupant_launch=self.occupant_launch(card), is_helper_job_open=card.is_helper_job_open, is_context_unknown=self.is_context_unknown(card))

    @staticmethod
    def occupant_launch(card: AgentCard) -> str:
        if card.helper_job_new_session is None:
            return ""
        return NEW_SESSION_LAUNCH if card.helper_job_new_session else RESUMED_SESSION_LAUNCH

    @staticmethod
    def helper_job(card: AgentCard) -> str:
        description = card.helper_job_description.strip()
        if description and description not in (card.given_name, card.profile, card.job_profile):
            return description[:100]
        return next((line.strip()[:100] for line in card.helper_job_brief.splitlines() if line.strip()), "")

    def is_context_unknown(self, card: AgentCard) -> bool:
        return self.current_window.is_session_unknown(card.program, card.session, card.compaction_ended_at)

    def context_percent(self, card: AgentCard, status: SessionStatus) -> int | None:
        if self.is_context_unknown(card):
            return None
        cap = self.caps.tokens(card.role, card.profile)
        if not status.is_reported:
            return self.share.usage_within(card.program, card.session, cap).percent
        return None if status.context_percent is None else self.share.reading_within(ContextWindow(status.context_percent, status.context_tokens), cap).percent

    def reported_model(self, card: AgentCard) -> str:
        return self.providers.reported_model(card.program, self.home, card.session)

    def session_effort(self, card: AgentCard) -> str:
        return self.providers.session_effort(card.program, self.home, card.session)

    @staticmethod
    def waiting_state(card: AgentCard, blocked_reason: str) -> str:
        if blocked_reason:
            return BLOCKED_STATE
        if card.usage_limit_ends_at is not None:
            return USAGE_LIMIT_STATE
        return WAITING_STATE if card.paused_at is not None else ""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentFactsList):
            output.write(value.line(), {"rows": [facts.json() for facts in value.agents]})
