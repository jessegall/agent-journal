import threading
from journal.console.support.outcome import Outcome
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_agent import StoryAgent
from tests.stories.builder.story_agents import StoryAgents
from journal.http.controllers.hooks import ACTOR_HEADER, ACTOR_TOKEN_HEADER
from journal.repositories.reviewers import Reviewers
from journal.repositories.scope import Scope
from journal.repositories.verifiers import Verifiers
from journal.support.caller import ACTOR, ACTOR_TOKEN, AGENT_SHELL, Caller
from journal.support.researcher_session import ResearcherSession
from journal.features.workers.workers_options import BUILDER_MODE
from tests.in_process import posted
from tests.agent_hooks import TOOLS
from tests.stories.builder.agent_steps import AgentSteps
from tests.stories.builder.fixture_copies import FixtureCopies
from tests.stories.builder.developer_steps import DeveloperSteps
from tests.stories.builder.hook_verdict import HookVerdict
from tests.stories.builder.journal_log import JournalLog
from tests.stories.builder.time_steps import TimeSteps
from tests.stories.builder.main_session import MAIN_SESSION
from tests.stories.builder.worker_steps import WorkerSteps, worker_session
from tests.stories.builder.setting_reads import SettingReads
from tests.stories.builder.step_result import StepResult
from tests.stories.builder.story_checks import StoryChecks
from tests.stories.builder.story_rows import StoryRows
from tests.stories.builder.user_steps import UserSteps
from tests.stories.fixtures.state_fixture import StateFixture


class Story(AgentSteps, UserSteps, WorkerSteps, TimeSteps, DeveloperSteps, StoryChecks, StoryRows):
    """One story played against a journal in-process for one provider: each step plays a real hook, command or viewer request and keeps what it brought, the lines the journal gave, the hook's verdict and the command's outcome, for the checks after it, and adds its action and what the journal did to the story's path, which counts from the fixture's state on; the settings it sets are noted with the place they were set, to ask whether the journal read them after, and its fixture is the one it began from, whose rows the story reads by kind, story.tasks.started, and its agents as story.agents, asked at the end whether the story used them all."""

    def __init__(self, app, program: type, reads: SettingReads, copies: FixtureCopies) -> None:
        self.copies = copies
        self.app, self.program, self.provider, self.tools, self.reads = app, program, program.name, TOOLS[program.name], reads
        self.set_positions: dict[str, int] = {}
        self.main_session_id = MAIN_SESSION
        self.agent = Caller.agent("main", MAIN_SESSION, program.name)
        self.log = JournalLog(app)
        self.said, self.verdict, self.command = (), None, None
        self.path: list[str] = []
        self.line_keys: set[str] = set()
        self.fixture = StateFixture()
        self.scope = AgentRole.MAIN
        self.stack_checked_at = -1
        self.shell_text, self.shell_exit, self.shell_outputs = "", 0, 0
        self.viewer_status, self.viewer_answer = 0, {}
        self.clock_outs_going: dict[int, tuple[threading.Thread, list]] = {}
        self.closers: list = []
        self.team_addresses: dict[str, str] = {}
        self.typed: list[str] = []
        self.typed_from = 0
        self.mode = BUILDER_MODE
        self.last_step = StepResult(self, (), None, None, "", 0, 0, {})

    def reach(self, fixture: type[StateFixture]) -> None:
        self.fixture = self.copies.reached(self, fixture)
        self.observed("", None, None)
        self.path = [f"starts from {fixture.__name__}"]
        self.typed_from = len(self.typed)
        self.stack_checked_at = -1
        self.set_positions = {key: self.reads.position() for key in self.copies.settings_left.get((fixture, self.provider), ())}

    @property
    def agents(self) -> StoryAgents:
        return StoryAgents(self.scope, self.fixture)

    def posted_hook(self, agent: StoryAgent, type_name: str, **body) -> tuple[int, object]:
        return self.session_posted_hook(self.hook_session_of(agent), self.headers_of(agent), type_name, {**self.hook_fields_of(agent), **body})

    def session_posted_hook(self, session: str, headers: dict, type_name: str, body: dict) -> tuple[int, object]:
        return posted(self.app, f"/hooks/{self.provider}", {"hook_event_name": type_name, "session_id": session, **body}, {"X-Journal-Env": "main", **headers})

    def is_stack_checked_last(self) -> bool:
        return self.stack_checked_at == len(self.path)

    def scoped_session(self) -> str:
        return self.session_of(self.agents.subject)

    def session_of(self, agent: StoryAgent) -> str:
        return {AgentRole.MAIN: self.main_session, AgentRole.WORKER: lambda: worker_session(agent.number), AgentRole.SUBAGENT: self.subagent_scope_session, AgentRole.REVIEWER: lambda: self.checker_session(Reviewers, agent.number), AgentRole.VERIFIER: lambda: self.checker_session(Verifiers, agent.number)}[agent.role]()

    def subagent_scope_session(self) -> str:
        return ResearcherSession.joined(self.main_session(), self.agents.subagent.agent_id)

    def hook_session_of(self, agent: StoryAgent) -> str:
        return self.main_session() if agent.role == AgentRole.SUBAGENT else self.session_of(agent)

    def hook_fields_of(self, agent: StoryAgent) -> dict:
        return {"agent_id": agent.agent_id} if agent.role == AgentRole.SUBAGENT else {}

    def main_session(self) -> str:
        return self.main_session_id

    def replace_main_session(self, session: str, provider: str) -> None:
        self.main_session_id, self.agent = session, Caller.agent("main", session, provider)

    def headers_of(self, agent: StoryAgent) -> dict:
        return {AgentRole.MAIN: dict, AgentRole.WORKER: lambda: {"X-Journal-Actor": f"worker:{agent.number}"}, AgentRole.SUBAGENT: dict, AgentRole.REVIEWER: lambda: self.checker_headers(f"reviewer:{agent.number}"), AgentRole.VERIFIER: lambda: self.checker_headers(f"verifier:{agent.number}")}[agent.role]()

    def shell_variables_of(self, agent: StoryAgent) -> dict[str, str]:
        variables = {"JOURNAL_ENV": "main", "JOURNAL_SESSION": self.session_of(agent), AGENT_SHELL: "1"}
        return {AgentRole.MAIN: lambda: variables, AgentRole.WORKER: lambda: {**variables, ACTOR: f"worker:{agent.number}"}, AgentRole.SUBAGENT: lambda: {**variables, "JOURNAL_SESSION": self.main_session()}}[agent.role]()

    def caller_of(self, agent: StoryAgent) -> Caller:
        return {AgentRole.MAIN: lambda: self.agent, AgentRole.WORKER: lambda: Caller.worker("main", agent.number, worker_session(agent.number), self.provider), AgentRole.SUBAGENT: lambda: self.agent.subagent_caller(self.subagent_scope_session()), AgentRole.REVIEWER: lambda: Caller.reviewer("main", agent.number, self.session_of(agent), self.provider), AgentRole.VERIFIER: lambda: Caller.verifier("main", agent.number, self.session_of(agent), self.provider)}[agent.role]()

    def checker_session(self, rows: type, number: int) -> str:
        with self.app.container.get(Scope).environment(1):
            return self.app.container.get(rows).find(number).session

    def checker_headers(self, stamp: str) -> dict:
        return {ACTOR_HEADER: stamp, ACTOR_TOKEN_HEADER: self.helper_token(stamp)}

    def helper_token(self, stamp: str) -> str:
        return next(launch[ACTOR_TOKEN] for launch in reversed(self.app.helper_launches) if launch.get(ACTOR) == stamp)

    def record_command(self, action: str, outcome: Outcome) -> StepResult:
        return self.observed(action, None, outcome)

    def unread_settings(self) -> list[str]:
        return [key for key, position in self.set_positions.items() if not self.reads.is_read(key, position)]

    def observed(self, action: str, verdict: HookVerdict | None, outcome: Outcome | None) -> StepResult:
        self.said, steps = self.log.new_entries()
        self.line_keys |= {line.key for line in self.said}
        self.verdict, self.command = verdict, outcome
        self.path += [action, *steps] if action else list(steps)
        self.last_step = StepResult(self, self.said, verdict, outcome, self.shell_text, self.shell_exit, self.viewer_status, self.viewer_answer)
        return self.last_step
