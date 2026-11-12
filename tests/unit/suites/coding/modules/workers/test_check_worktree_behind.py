from contextlib import nullcontext
from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus as CommandBus
from engine.scope.scopes import Scopes
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from suites.coding.modules.workers.commands.announce_behind_checks.announce_behind_checks import AnnounceBehindChecks
from suites.coding.modules.workers.commands.announce_behind_checks.announce_behind_checks_handler import AnnounceBehindChecksHandler
from suites.coding.modules.workers.commands.check_worktree_behind.check_worktree_behind import CheckWorktreeBehind
from suites.coding.modules.workers.commands.check_worktree_behind.check_worktree_behind_handler import CheckWorktreeBehindHandler
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.enums.behind_route import BehindRoute
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.behind_nudges import BEHIND_FOR_MAIN_AGENT, FAST_FORWARDED
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED, UPDATE_TO_MAIN_COMMITS
from suites.coding.modules.workers.ticks.behind_worktrees import BehindWorktrees

TIP = "0123456789abcdef"


def worktree(worktree_id: int = 1) -> Worktree:
    return Worktree(id=worktree_id, environment_id=1, session_agent_id=7, task_id=1, creator_id=1, folder="/work", branch="workers/one", base_branch="version-5", state=WorktreeState.CUT)


class Rows:
    def required(self, model: type, row_id: int) -> object:
        return worktree(row_id)


class Git:
    def __init__(self, behind: int, own_work: bool = False, forwards: bool = True) -> None:
        self.count, self.own_work, self.forwards = behind, own_work, forwards
        self.forwarded: list[str] = []

    def tip(self, folder: str, branch: str) -> str:
        return TIP

    def behind(self, worktree: Worktree) -> int:
        return self.count

    def has_own_work(self, worktree: Worktree) -> bool:
        return self.own_work

    def fast_forward(self, worktree: Worktree, tip: str) -> bool:
        self.forwarded.append(tip)
        return self.forwards


class Checks:
    def opens(self, worktree: Worktree, behind: int) -> bool:
        return behind >= 3


class Repository:
    def __init__(self) -> None:
        self.saved: list[object] = []

    def save(self, row, context):
        saved = replace(row, id=len(self.saved) + 1)
        self.saved.append(saved)
        return saved

    def save_change(self, row, changed, context):
        self.saved.append(changed)
        return changed


class Settings:
    def __init__(self, to_main: int = 0, merger: bool = True) -> None:
        self.values = {UPDATE_TO_MAIN_COMMITS: to_main, MERGER_ENABLED: merger}

    def number(self, key: str) -> int:
        return int(self.values[key])

    def flag(self, key: str) -> bool:
        return bool(self.values[key])


class Operations:
    def __init__(self, running: object | None = None) -> None:
        self.running = running

    def active(self, worker_id: int) -> object | None:
        return self.running


class Lines:
    def __init__(self) -> None:
        self.sent: list[object] = []

    def send_nudge(self, nudge, source, context) -> None:
        self.sent.append(nudge)

    def send(self, agent_id, declaration, source, context, **fields) -> None:
        self.sent.append((agent_id, declaration, fields))


class Numbers:
    def number(self, model: str, row_id: int) -> int:
        return 4


class Context:
    timestamp = None


def routed(git: Git, settings: Settings | None = None, operations: Operations | None = None) -> tuple[BehindRoute, Repository, Lines, Lines]:
    repository, main_line, nudger = Repository(), Lines(), Lines()
    handler = CheckWorktreeBehindHandler(Rows(), git, Checks(), repository, settings or Settings(), operations or Operations(), main_line, nudger, Numbers())
    handler.prepare(CheckWorktreeBehind(1), Actor.core())
    return handler.handle(CheckWorktreeBehind(1), Context()), repository, main_line, nudger


def test_a_worktree_with_nothing_of_its_own_moves_onto_the_base_at_once_and_its_worker_reads_one_line():
    git = Git(4)
    route, repository, _, nudger = routed(git)
    states = [row.state for row in repository.saved if hasattr(row, "behind")]
    assert (route, git.forwarded, states[-1], nudger.sent[0][1]) == (BehindRoute.FAST_FORWARDED, [TIP], BehindCheckState.UPDATED, FAST_FORWARDED)


def test_no_fast_forward_while_a_command_of_the_worker_runs_or_when_git_refuses_it():
    running = routed(Git(4), operations=Operations(running=object()))
    refused = routed(Git(4, forwards=False))
    assert (running[0], refused[0]) == (BehindRoute.MERGER, BehindRoute.MERGER)
    assert [row.state for row in refused[1].saved] == [BehindCheckState.OPEN]


def test_at_twenty_to_the_main_agent_twenty_five_behind_goes_to_the_main_agent_and_nineteen_to_the_merger():
    far, _, main_line, _ = routed(Git(25, own_work=True), Settings(to_main=20))
    near = routed(Git(19, own_work=True), Settings(to_main=20))[0]
    assert (far, near, main_line.sent[0].key) == (BehindRoute.MAIN_AGENT, BehindRoute.MERGER, BEHIND_FOR_MAIN_AGENT.key)


class Bus:
    def __init__(self) -> None:
        self.dispatched: list[object] = []

    def dispatch(self, command, context) -> None:
        self.dispatched.append(command)


class Queries:
    def query(self, model: type) -> "Queries":
        return self

    def filter(self, **values: object) -> "Queries":
        return self

    def newest(self) -> "Queries":
        return self

    def first(self) -> None:
        return None


def announced(merger_on: bool) -> tuple[Lines, tuple[object, ...]]:
    inbox = Lines()
    lines = AnnounceBehindChecksHandler(Rows(), Queries(), inbox, Settings(merger=merger_on), Numbers()).handle(AnnounceBehindChecks((1, 2, 3, 4, 5)), Context())
    return inbox, lines


def test_five_worktrees_of_one_look_leave_five_lines_for_the_merger():
    inbox, lines = announced(True)
    assert (len(inbox.sent), len(lines)) == (5, 5)


class LookBus:
    def __init__(self) -> None:
        self.ran: list[object] = []

    def run(self, command, actor, environment_id=None):
        self.ran.append(command)
        return ("the first line",) if isinstance(command, AnnounceBehindChecks) else None


class OpenScopes:
    def opened(self, actor_id, environment_id=None):
        return nullcontext()


class LookContainer:
    def __init__(self, merger_on: bool) -> None:
        self.bus = LookBus()
        self.instances = {CommandBus: self.bus, Scopes: OpenScopes(), SettingValues: Settings(merger=merger_on), Clock: Clock()}

    def get(self, kind):
        return self.instances[kind]


def test_one_look_starts_the_merger_once_for_all_its_worktrees_and_none_with_the_merger_off():
    on, off = LookContainer(True), LookContainer(False)
    BehindWorktrees.announced(on, (1, 2, 3, 4, 5), 1)
    BehindWorktrees.announced(off, (1, 2, 3, 4, 5), 1)
    assert [type(command) for command in on.bus.ran] == [AnnounceBehindChecks, StartMerger]
    assert [type(command) for command in off.bus.ran] == [AnnounceBehindChecks]
