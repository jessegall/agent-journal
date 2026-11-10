import shutil
from dataclasses import dataclass
from pathlib import Path

import pytest

import suites.coding.modules.workers as workers_package
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.query.queries import Queries
from core.modules.messages.models.message import Message
from engine.testing.stories.story import Story
from suites.coding.modules.workers.commands.record_worker_refusal.record_worker_refusal import RecordWorkerRefusal
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.support.shipped_profiles import HELPER_PROFILES
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DISPATCH, FIRST_PROOF, delivered_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from tests.stories.suites.coding.modules.workers.support.judge_plugin import SINFUL_TEXT, judge_plugin_folder
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with, merger_can_start, running_launcher
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, start_planned_worker
from tests.stories.support.story_checks import expect_value, expect_value_with

MERGER_ROLE_REFUSAL = "only the merger runs this"
LOG_REVIEW_REFUSAL = "reviews a worker's logs"
LOG_LINE = "The cart total rounds down"
FULL_SUITE = "pytest"
WHY = "the rounding only shows in a real run"
MERGER_QUESTION = 'merger tell "Which tax applies?" --tried "Read the brief" --option "Dutch tax" --option "No tax" --recommend "Dutch tax"'
LINKED_LINE = "the libraries of your worktree are linked"
LIBRARY_FILE = "index.js"
LIBRARY_TEXT = "module.exports = 1\n"


@dataclass(frozen=True)
class MergerCase:
    """A worker with its merger running, and the rows the stories compare."""

    story: Story
    repository: GitRepository
    worker: Actor
    merger: Actor

    def scope(self) -> str:
        outcome = self.story.run(f"merger scope {self.worker.id}", actor=self.merger)
        assert outcome.code == 0, outcome.output_text
        return outcome.output_text

    def refused_at_hand_in(self, text: str) -> None:
        worktree = self.story.container.get(Queries).query(Worktree).filter(session_agent_id=self.worker.id).first()
        self.story.container.get(Bus).run(RecordWorkerRefusal(worktree.id, text), self.worker, environment_id=1)

    def main_lines(self) -> str:
        self.story.run_listeners()
        return self.story.run(f"agent-line list --agent {self.story.agent.id}", actor=self.story.agent).output_text

    def worker_lines(self) -> str:
        self.story.run_listeners()
        return self.story.run(f"agent-line list --agent {self.worker.id}").output_text

    def main_messages(self) -> tuple[Message, ...]:
        return tuple(self.story.container.get(Queries).query(Message).filter(session_agent_id=self.merger.id).all_rows())

    def marks(self) -> str:
        self.story.run_listeners()
        return self.story.run("chat-mark list --environment 1").output_text


def running_merger(story: Story, worker: Actor) -> Actor:
    with running_launcher(story):
        story.expect_success('worker report "The cart needs a look"', actor=worker)
        story.run_listeners()
    return Actor(merger_agent(story).id, ActorType.AGENT)


def merger_case(story: Story, repository: GitRepository, dispatch: str = DISPATCH) -> MergerCase:
    worker = dispatched_worker(story, dispatch)
    return MergerCase(story, repository, worker, running_merger(story, worker))


@pytest.fixture
def case(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    return merger_case(story, repository_environment(story))


@pytest.fixture
def own_files(case):
    case.repository.changed(case.worker.id, "cart.py", CART_CHANGE)
    case.repository.changed(case.worker.id, "rate.py", CART_CHANGE)
    return case


@pytest.fixture
def linked(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.library("node_modules", LIBRARY_FILE, LIBRARY_TEXT)
    return merger_case(story, repository, f"{DISPATCH} --library-link node_modules")


@pytest.fixture
def copied(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.library("vendor", LIBRARY_FILE, LIBRARY_TEXT)
    return merger_case(story, repository, f"{DISPATCH} --library-copy vendor")


@pytest.fixture
def spent_case(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_success("setting set journal.suites.coding.workers.worker-phase-test-runs 0 --environment main", actor=worker.story.user)
    return MergerCase(worker.story, worker.repository, worker.worker, running_merger(worker.story, worker.worker))


def test_merger_scope_says_when_all_refused_files_are_the_workers(own_files):
    own_files.refused_at_hand_in("cart.py has a sin")
    own_files.story.expect_rows("all refused files are yours" in own_files.scope(), detail=own_files.scope())


def test_merger_scope_of_a_worker_with_no_worktree_is_refused(case):
    expect_refused_with(case.story, f"merger scope {case.merger.id}", "has no worktree", actor=case.merger)


def test_only_the_merger_runs_merger_scope(case):
    case.story.expect_refusal(f"merger scope {case.worker.id}", MERGER_ROLE_REFUSAL, actor=case.worker)
    case.story.expect_refusal(f"merger scope {case.worker.id}", MERGER_ROLE_REFUSAL, actor=case.story.agent)


@pytest.mark.real_git
def test_merger_scope_reads_a_real_judge_refusal(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"plugin install {judge_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    judged = merger_case(story, repository_environment(story))
    judged.repository.changed(judged.worker.id, "cart.py", SINFUL_TEXT)
    story.expect_success(FIRST_PROOF, actor=judged.worker)
    story.expect_refusal("worker deliver --wait --differences none", "cart.py has a sin", actor=judged.worker)
    judged.story.expect_rows("own and refused: cart.py" in judged.scope(), detail=judged.scope())


def test_repair_with_nothing_missing_says_so_and_tells_the_worker_nothing(linked):
    lines_at_start = linked.worker_lines()
    linked.story.expect_text(f"merger repair {linked.worker.id}", "nothing missing", actor=linked.merger)
    linked.story.expect_rows(linked.worker_lines() == lines_at_start, detail=linked.worker_lines())


def test_a_second_repair_finds_nothing_and_does_not_tell_the_worker_again(linked):
    (linked.repository.worktree_folder(linked.worker.id) / "node_modules").unlink()
    linked.story.expect_success(f"merger repair {linked.worker.id}", actor=linked.merger)
    linked.story.expect_text(f"merger repair {linked.worker.id}", "nothing missing", actor=linked.merger)
    linked.story.expect_rows(linked.worker_lines().count(LINKED_LINE) == 1, detail=linked.worker_lines())


def test_repair_of_a_worker_with_no_worktree_is_refused(case):
    expect_refused_with(case.story, f"merger repair {case.merger.id}", "has no worktree", actor=case.merger)


def test_only_the_merger_runs_merger_repair(case):
    case.story.expect_refusal(f"merger repair {case.worker.id}", MERGER_ROLE_REFUSAL, actor=case.worker)
    case.story.expect_refusal(f"merger repair {case.worker.id}", MERGER_ROLE_REFUSAL, actor=case.story.agent)


def test_a_named_test_run_with_a_library_missing_says_the_merger_can_relink(linked):
    (linked.repository.worktree_folder(linked.worker.id) / "node_modules").unlink()
    expect_refused_with(linked.story, "worker test python tests/cart.py", "node_modules", "the merger can relink", AskTopic.TOOL.question_line(), actor=linked.worker)


@pytest.mark.parametrize("line", [
    'merger tell "Which tax applies?" --option "Dutch tax" --option "No tax" --recommend "Dutch tax"',
    'merger tell "Which tax applies?" --tried "Read the brief" --recommend "Dutch tax"',
    'merger tell "Which tax applies?" --tried "Read the brief" --option "Dutch tax" --recommend "Dutch tax"',
    'merger tell "Which tax applies?" --tried "Read the brief" --option "Dutch tax" --option "No tax"',
    'merger tell "   " --tried "Read the brief" --option "Dutch tax" --option "No tax" --recommend "Dutch tax"',
], ids=["no tried", "no options", "one option", "no recommendation", "empty what"])
def test_a_tell_without_every_part_is_refused_with_the_shape(case, line):
    expect_refused_with(case.story, line, "--tried", "--option", "--recommend", actor=case.merger)
    case.story.expect_rows(case.main_messages() == ())


def test_a_case_no_command_covers_ends_at_the_main_agent_with_the_facts_of_the_worker(own_files):
    own_files.story.expect_success(f"{MERGER_QUESTION} --worker {own_files.worker.id}", actor=own_files.merger)
    text = own_files.main_messages()[0].text
    own_files.story.expect_rows("Recommendation: Dutch tax" in text, "point build, task 1" in text, "cart.py, rate.py" in text, detail=text)


def test_only_the_merger_tells(case):
    case.story.expect_refusal(MERGER_QUESTION, MERGER_ROLE_REFUSAL, actor=case.story.agent)
    case.story.expect_refusal(MERGER_QUESTION, MERGER_ROLE_REFUSAL, actor=case.worker)


def test_a_tell_shows_a_mark_in_the_chat(case):
    case.story.expect_success(MERGER_QUESTION, actor=case.merger)
    case.story.expect_rows("The merger asks" in case.marks(), detail=case.marks())


def test_a_pass_shows_a_mark_in_the_chat(case):
    case.repository.changed(case.worker.id, "cart.py", CART_CHANGE)
    case.story.expect_success(FIRST_PROOF, actor=case.worker)
    case.story.expect_success("worker deliver --wait --differences none", actor=case.worker)
    case.story.expect_success(f'merger pass {case.worker.id} "A design choice"', actor=case.merger)
    case.story.expect_rows("The merger left" in case.marks(), detail=case.marks())


def test_an_advice_from_the_merger_to_a_worker_shows_no_ask_mark(case):
    case.story.expect_success(f'merger advise {case.worker.id} "Look at the cart"', actor=case.merger)
    case.story.expect_rows("The merger asks" not in case.marks(), detail=case.marks())


def test_a_tell_of_the_main_agents_own_message_shows_no_ask_mark(case):
    case.story.expect_success(f'message send "Look at the cart" --to agent:{case.worker.id}', actor=case.story.agent)
    case.story.expect_rows("The merger asks" not in case.marks(), detail=case.marks())


def merger_skill_text() -> str:
    return (Path(workers_package.__file__).parent / "skills" / "journal-merger" / "SKILL.md").read_text()


def test_the_merger_text_names_the_ladder_and_the_case_book(case):
    profile = next(row for row in HELPER_PROFILES if row.name == "journal-merger")
    case.story.expect_rows("Ladder" in profile.body, "journal merger scope" in profile.body, "journal merger repair" in profile.body, "journal helper grant" in profile.body, "journal-merger" in profile.body, detail=profile.body)


@pytest.mark.parametrize("case_text", ["journal merger scope", "journal merger repair", "journal helper grant", "already built", "add the case to this file"])
def test_the_case_book_holds_each_known_case(case_text):
    expect_value_with(merger_skill_text(), case_text)


def logs_read_at(story: Story, worker: Actor) -> str | None:
    return story.container.get(Queries).query(Worktree).filter(session_agent_id=worker.id).first().logs_read_at


def test_the_merger_reads_the_logs_of_a_worker_that_delivered_and_they_count_as_read(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = delivered_worker(story, repository_environment(story))
    story.expect_success(f'task log 1 "{LOG_LINE}"', actor=worker)
    merger = running_merger(story, worker)
    story.expect_success(f"worker logs {worker.id}", actor=merger)
    expect_value(logs_read_at(story, worker) is None, False)


def test_the_merger_reads_the_logs_of_a_worker_whose_hand_ins_keep_failing(case):
    case.story.expect_success(f'task log 1 "{LOG_LINE}"', actor=case.worker)
    case.story.expect_text(f"worker logs {case.worker.id} --task 1", LOG_LINE, actor=case.merger)


def test_reading_logs_before_a_delivery_does_not_count_for_the_merge(case):
    case.story.expect_success(f"worker logs {case.worker.id}", actor=case.merger)
    expect_value(logs_read_at(case.story, case.worker), None)


def test_a_worker_may_not_read_the_logs_of_a_worker(case):
    case.story.expect_refusal(f"worker logs {case.worker.id}", LOG_REVIEW_REFUSAL, actor=case.worker)


def test_the_main_agent_still_needs_a_delivery_to_review(case):
    case.story.expect_refusal(f"worker logs {case.worker.id}", "has delivered nothing to review", actor=case.story.agent)


def test_the_merger_grants_a_run_that_names_its_test_file(spent_case):
    spent_case.story.expect_success(f"helper grant {spent_case.worker.id} pytest tests/cart.py", actor=spent_case.merger)
    spent_case.story.expect_rows("helper-grant:1" in spent_case.worker_lines(), detail=spent_case.worker_lines())


def test_the_merger_may_not_grant_a_run_with_no_test_file(spent_case):
    spent_case.story.expect_refusal(f"helper grant {spent_case.worker.id} pytest tests", "name each test file", actor=spent_case.merger)


def test_the_main_agent_hears_nothing_of_a_grant_the_merger_gives(spent_case):
    spent_case.story.expect_success(f"helper grant {spent_case.worker.id} pytest tests/cart.py", actor=spent_case.merger)
    spent_case.story.expect_rows("helper-grant" not in spent_case.main_lines(), detail=spent_case.main_lines())
