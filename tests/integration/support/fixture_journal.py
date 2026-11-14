from dataclasses import dataclass, field
from typing import cast

from engine.actor.actor import Actor
from engine.container.container import Container
from engine.database.repeated_work import RepeatedWork
from engine.driver.hook_reply import HookReply
from engine.enums.actor_type import ActorType
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from engine.query.queries import Queries
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.unread_skills import UnreadSkills
from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.testing.examples.shell_part import ShellPart
from engine.testing.examples.hook_sample import HookSample
from engine.testing.examples.hook_samples import HookSamples
from engine.time.clock import Clock
from tests.integration.support.integration_journal import MAIN_ENVIRONMENT, IntegrationJournal


@dataclass(frozen=True)
class FixtureLine:
    """What one line printed, checked the way a moved story checks it."""

    code: int
    output_text: str

    def expect_text(self, *texts: str) -> None:
        assert all(text in self.output_text for text in texts), self.output_text

    def expect_no_text(self, text: str) -> None:
        assert text not in self.output_text, self.output_text


@dataclass
class FixtureJournal:
    """An integration journal copied from a story fixture's template, with the agent and user that fixture made, so a
    mechanical story moved to tests/integration starts from the same state. A person's line runs in the main
    environment and an agent's in its own, as in a story."""

    journal: IntegrationJournal
    agent: Actor = field(default_factory=Actor.core)
    user: Actor = field(default_factory=Actor.core)

    @property
    def home(self) -> JournalHome:
        return self.journal.home

    @property
    def container(self) -> Container:
        return self.journal.container

    @property
    def clock(self) -> Clock:
        return self.container.get(Clock)

    def run(self, line: str, actor: Actor | None = None, environment_id: int | None = None) -> FixtureLine:
        caller_environment = environment_id or (None if actor is not None and actor.type is ActorType.AGENT else MAIN_ENVIRONMENT)
        if "environment make" in line:
            caller_environment = None
        with self.journal.database.repeated_work.request():
            answer = self.journal.run(line, actor, caller_environment)
        return FixtureLine(answer.code, answer.text)

    def new_row_id(self, line: str, actor: Actor | None = None) -> int:
        return self.journal.new_row_id(line, actor)

    def hook(self, session: str, sample: HookSample) -> HookReply:
        return self.journal.hook(session, sample)

    @property
    def repeated_work(self) -> RepeatedWork:
        return cast(RepeatedWork, self.journal.database.repeated_work)

    # binds the instance for the type, as a story replaces one of the story kit's own bindings
    def replace(self, kind: type, instance: object) -> None:
        self.container.bind(kind, instance)

    # what an agent does after its session starts: it reads the overview and reads the file of each skill it must load,
    # through its program's Read tool, so the journal's own blocks and refusals lift as they do for a real agent
    def reads_what_it_must(self, session: str) -> None:
        self.hook(session, HookSamples.shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"], subcommand="overview")))
        self.run("overview", actor=self.agent)
        skills = {skill.folder: skill.path for skill in self.container.get(SkillCatalogue).skills()}
        for name in self.container.get(UnreadSkills).unread(self.agent.id):
            self.hook(session, HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [skills[name]], "diff": None}))
        self.run_listeners()

    def row(self, model: type, row_id: int):
        return self.container.get(Queries).query(model).find(row_id)

    def run_listeners(self) -> None:
        self.container.get(CommitListenerRunner).run()

    def expect_success(self, line: str, *texts: str, actor: Actor | None = None) -> FixtureLine:
        answer = self.run(line, actor)
        assert answer.code == 0 and all(text in answer.output_text for text in texts), (line, answer)
        return answer

    def expect_text(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        self.run(line, actor).expect_text(*texts)

    def expect_rows(self, *conditions: bool, detail: str = "") -> None:
        assert all(conditions), detail
