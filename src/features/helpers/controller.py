import json
import time
from dataclasses import dataclass
from pathlib import Path

import controllers.types as types_module
import features
import resources.types as resources_module
from controllers.base import Controller
from agents.terminal import prompted
from controllers.requests import request
from controllers.types import Agents, Environments, Messages, Nudges, Todos
from engine import attic, bus
from engine.outbox import Request
from engine.record import Record
from engine.sessions import Sessions
from features.agent_sessions.launch import launched, prepared, tell_in
from features.helper_worktrees.controller import Worktrees
from features.form_of_address.address import voice_of
from features.helpers.resource import Helper, held_by_helper
from features.helpers.reuse import HELPER_KIND, agent_runs, kept, knowing, named_paths, refusal, unlanded, written_tests
from resources.base import AGENT, SYSTEM, USER, Ref, Refused, titled
from resources.types import HELPER, MergeWait, Todo
from controllers.marks import action
from engine.wording import slugged
from resources.types import EnvironmentKind

STOP_WAIT, STOP_POLL = 5.0, 0.1


def kickoff(row, folder: Path, todo: int, handed: list[Todo], dispatcher: str) -> str:
    return (f"You are {row.name}, a helper dispatched for one bounded job. The job: {row.title}\n\n{row.brief}\n\n"
            f"It is to-do {todo} on your own list: take it with journal todo start {todo}, keep its work log as you go, "
            f"and close it with journal todo done {todo} --how \"<what landed>\" before you report. "
            f"{handed_over(handed)}"
            f"Work only on this job, in {folder}. Commit what you change there; never push, never switch branches. "
            f"Write the test that proves your change but never run tests, builds of tests or checks: name the tests you wrote in your report, and {dispatcher} runs them. "
            f"You report to {dispatcher}, the agent that dispatched you: address {dispatcher} by that name and never the user, "
            f"do not write to the user, and do not write rules, facts or docs. "
            f"Other helpers {dispatcher} dispatched are listed by journal helper peers; write to one with journal helper say <n> \"<text>\", "
            f"and its answer reaches your next turn the same way, whichever provider either of you runs on. "
            f"When the job is done, or you cannot go on, finish with journal helper report \"<what you did, what you found, what is left>\", "
            f"written to {dispatcher}: that is the only way your answer reaches {dispatcher}.")


def refuse_unreadable_settings(folder: Path) -> None:
    path = folder / ".claude" / "settings.json"
    if not path.is_file():
        return
    try:
        settings = json.loads(path.read_text())
    except ValueError as failure:
        raise Refused(f"{path} is not valid JSON, so Claude Code would stop a helper at start with a dialog it cannot answer: fix the file first") from failure
    if not isinstance(settings, dict) or not isinstance(settings.get("hooks", {}), dict):
        raise Refused(f"{path} holds hooks that are not an object, so Claude Code would stop a helper at start with a dialog it cannot answer: "
                      f"make hooks an object or take it out of the file first")


def numbers_in(text: str) -> tuple[int, ...]:
    return tuple(int(n) for n in str(text).replace(",", " ").split())


def held(record, helper) -> list[Todo]:
    return [t for t in Todos(record, actor=SYSTEM).rows.standing() if t.assigned == helper.ref]


def unmarked(record, helper) -> list[Todo]:
    return [t for t in held(record, helper) if not t.pending]


def give_back(record, todos: list[Todo]) -> None:
    listed = Todos(record, actor=SYSTEM)
    for todo in todos:
        listed.unassign(todo.n)


def left_behind(record) -> list[Todo]:
    """Open to-dos still assigned to a helper that has finished or is gone."""
    helpers = Helpers(record, actor=SYSTEM)
    return [todo for todo in Todos(record, actor=SYSTEM).rows.standing() if held_by_helper(todo) and helpers._holder(todo) is None]


def stop_helpers(record: Record) -> None:
    root = record.root
    standing = [place for place in Environments(record, actor=SYSTEM).rows.standing() if place.helping and Sessions(root).holder(place.title)]
    for place in standing:
        request(root, Request(place.launched_from, Helpers.resource.type, "stop", [place.owned_by(HELPER)]))


def given_back(todos: list[Todo]) -> str:
    return f"; given back: to-do {', '.join(str(t.n) for t in todos)}" if todos else ""


def handed_over(todos: list[Todo]) -> str:
    if not todos:
        return ""
    listed = "\n".join(f"- to-do {t.n}: {t.title}" + (f" ({t.brief})" if t.brief else "") for t in todos)
    return (f"These to-dos of the agent that dispatched you are yours alone:\n{listed}\n"
            f"Read one with journal helper todo <n>; the numbers are the dispatching agent's, not your own list's. "
            f"When a commit of yours holds one, mark it with journal helper done <n> \"<what landed>\": "
            f"it shows as done and closes once your work is taken. ")


@dataclass(frozen=True)
class HandedRow:
    """A to-do handed to a helper as the dispatching agent holds it, with the list it lives on."""

    helper: Helper
    listed: Todos
    row: Todo


class Helpers(Controller):
    resource = Helper

    @action(network=True)
    def dispatch(self, name: str, job: str, provider: str = "", model: str = "", brief: str = "", worktree: bool = False, checkout: str = "",
                 todos: str = "") -> str:
        census, paths = kept(self.record, self.rows.standing()), named_paths(f"{job}\n{brief}")
        limits = features.FEATURES["helpers"].values(self.record)
        held_back = refusal(census, limits, HELPER_KIND, paths)
        if held_back:
            raise Refused(held_back)
        row = self._dispatched(name, job, provider, model, brief, worktree, checkout, numbers_in(todos))
        return f"helper {row.n}, {name}, started on {provider} {model}; you are told when it reports{knowing(census, paths)}"

    def _dispatched(self, name: str, job: str, provider: str, model: str, brief: str = "", worktree: bool = False, checkout: str = "",
                    todos: tuple[int, ...] = ()):
        from providers import DRIVERS, PROVIDERS
        if provider not in DRIVERS:
            raise Refused(f"a helper runs on one of {', '.join(DRIVERS)}, not {provider!r}")
        if not model.strip():
            raise Refused("a helper's model is always named: --model <model>")
        offered = PROVIDERS[provider]()
        if not offered.offers(model):
            raise Refused(f"{provider} does not offer {model}; choose one of {', '.join(offered.models())}")
        if worktree and checkout:
            raise Refused("a helper works either in a worktree of its own or in a checkout you name: give --worktree or --checkout, not both")
        handed = self._handable(todos)
        project = self.record.root.resolve().parent
        folder = self._checkout(project, checkout) if checkout else project
        refuse_unreadable_settings(folder)
        slug = slugged(name, limit=30)
        if not slug:
            raise Refused(f"a helper needs a name, such as Rhea; {name!r} has no letters to name it by")
        place = Environments(self.record, actor=SYSTEM).unused(slugged(f"{self.record.env}-{slug}", limit=30), ": finish that helper first, or choose another name")
        row = self.create(job, brief=brief, name=name, provider=provider, model=model, environment=place, checkout=str(folder) if checkout else "")
        if checkout:
            Worktrees(self.record, actor=SYSTEM)._adopt(folder, row.name)
        for earlier in self.rows.standing():
            if earlier.n != row.n and earlier.environment == place:
                Controller.complete(self, earlier.n, how=f"carried on by helper {row.n} in the same environment")
        if worktree:
            given = Worktrees(self.record, actor=SYSTEM)._cut(place, helper=name)
            folder = Path(given.path)
            row = self.update(row.n, worktree=str(given.n))
        home = prepared(self.record, place, f"Where helper {row.name} works on {job}", row.ref, folder, EnvironmentKind.HELPER)
        todo = Todos(home, actor=SYSTEM).create(job, brief=brief)
        Messages(home, actor=AGENT).create(titled(job), brief=f"{job}\n\n{brief}".strip(), from_main=True, opening=True)
        self._handed(row, home, handed)
        prompt = kickoff(row, folder, todo.n, handed, voice_of(self.record).agent_name)
        try:
            launched(self.record, place, provider, prompted(self.record.root, place, ["--model", model], prompt), folder)
        except Exception:
            give_back(self.record, handed)
            raise
        Agents(self.record, actor=SYSTEM)._mark_primary(f"Dispatched helper {row.n}", name=row.name, icon="bot", detail=f"{provider} {model}")
        return row

    def _handable(self, numbers: tuple[int, ...]) -> list[Todo]:
        listed = Todos(self.record, actor=SYSTEM)
        rows = [listed.load(n) for n in numbers]
        for row in rows:
            if row.completed:
                raise Refused(f"todo {row.n} is already done; hand a helper only open to-dos")
            if row.pending:
                raise Refused(f"todo {row.n} is done by {row.assigned} and waits for its merge; it cannot move to another helper")
            if row.assigned and self._holder(row) is None:
                raise Refused(f"todo {row.n} is already assigned to {row.assigned}")
        return rows

    def _holder(self, row: Todo) -> Helper | None:
        """The helper that holds a to-do, when one still works on it."""
        if not held_by_helper(row):
            return None
        n = Ref.parse(row.assigned).n
        return self.load(n) if self.rows.exists(n) and not self.load(n).completed else None

    def _left(self, holder: Helper, given: Todo, row: Helper) -> None:
        """Tells the helper a to-do moved away from that it did, and takes it off that helper's own list."""
        home = Record(self.record.root, holder.environment)
        for copy in (t for t in Todos(home, actor=SYSTEM).rows.standing() if t.handed == str(given.n)):
            Todos(home, actor=SYSTEM).strike(copy.n, f"moved to helper {row.n}, {row.name}")
        tell_in(self.record, holder.environment, holder.provider,
                f"To-do {given.n}, {given.title}, now belongs to helper {row.n}, {row.name}. Stop working on it and leave it out of your report.")

    @action
    def allow_suite(self, n: int) -> str:
        helper = self.update(n, whole_suite=True)
        return f"helper {helper.n} may run tests"

    @action
    def todo(self, n: int) -> str:
        """Reads a to-do handed to this helper by the number the agent that dispatched it knows, which its own list does not carry."""
        row = self._handed_to_me(n).row
        return f"to-do {row.n}: {row.title}\n{row.abstract}\n{row.brief}".strip()

    def _handed_to_me(self, n: int) -> "HandedRow":
        place = self._helping()
        if not place:
            raise Refused("only a helper reads or marks a to-do it was handed; the agent that dispatched it works its own with journal todo")
        helper = self._helper(place)
        listed = Todos(Record(self.record.root, place.launched_from), actor=SYSTEM)
        row = listed.load(n)
        if row.assigned != helper.ref:
            raise Refused(f"todo {row.n} was not handed to you; use only the to-dos your kickoff names")
        return HandedRow(helper, listed, row)

    @action
    def done(self, todo: int, how: str) -> str:
        handed = self._handed_to_me(todo)
        helper, listed, row = handed.helper, handed.listed, handed.row
        for copy in (t for t in Todos(self.record, actor=SYSTEM).rows.standing() if t.handed == str(row.n)):
            Todos(self.record, actor=SYSTEM).complete(copy.n, how)
        if not helper.worktree:
            request(self.record.root, Request(listed.record.env, Todos.resource.type, "complete", [row.n], {"how": how}))
            return f"todo {row.n} is done"
        request(self.record.root, Request(listed.record.env, Todos.resource.type, "update", [row.n], {"pending": MergeWait(how, helper.worktree).to_json()}))
        return f"todo {row.n} shows as done; it closes once your work is taken"

    @staticmethod
    def _checkout(project: Path, path: str) -> Path:
        folder = (project / path).resolve()
        if folder != project and project not in folder.parents:
            raise Refused(f"--checkout names a checkout inside the project, {project}; {folder} is outside it")
        if not (folder / ".git").exists():
            raise Refused(f"{folder} is not a git checkout: --checkout names the folder that holds .git, such as platform")
        return folder

    def _handed(self, row, home: Record, handed: list[Todo]) -> None:
        listed, own = Todos(self.record, actor=SYSTEM), Todos(home, actor=SYSTEM)
        for given in handed:
            holder = self._holder(given)
            if holder is not None and holder.n == row.n:
                continue
            if holder is not None:
                self._left(holder, given, row)
            listed.assign(given.n, to=row.ref)
            own.create(given.title, brief=given.brief, handed=str(given.n))

    @action(network=True)
    def say(self, n: int, text: str, todos: str = "") -> str:
        place = self._helping()
        if place:
            return self._said_to_peer(place, n, text, todos)
        row = self._unfinished(n, "finished")
        handed = self._handable(numbers_in(todos))
        words = f"{handed_over(handed)}\n{text}" if handed else text
        if not tell_in(self.record, row.environment, row.provider, words):
            raise Refused(f"helper {n}, {row.name}, is not running; dispatch it again to go on")
        home = Record(self.record.root, row.environment)
        Messages(home, actor=AGENT).create(titled(text), brief=text, from_main=True)
        self._handed(row, home, handed)
        Helpers(self.record, actor=SYSTEM).update(n, report="", answering=True)
        return f"sent to {row.name}" + (f", with to-do {', '.join(str(t.n) for t in handed)}" if handed else "")

    @action
    def peers(self) -> list[str]:
        place = self._helping()
        if not place:
            raise Refused("only a helper has peers; journal helper all lists the helpers you dispatched")
        me = self._helper(place)
        return [f"helper {row.n}, {row.name}, on {row.provider}: {row.title}"
                for row in Helpers(Record(self.record.root, place.launched_from), actor=SYSTEM).rows.standing() if row.n != me.n]

    @action
    def report(self, text: str) -> str:
        place = self._helping()
        if not place:
            raise Refused("only a helper reports, from the environment it was dispatched into")
        self._told(place, text)
        return "reported; the agent that dispatched you has it"

    def _said_to_peer(self, place, n: int, text: str, todos: str) -> str:
        if todos:
            raise Refused("only the agent that dispatched you hands out to-dos; send the words alone")
        me = self._helper(place)
        peer = Helpers(Record(self.record.root, place.launched_from), actor=SYSTEM)._unfinished(n, "finished")
        if peer.n == me.n:
            raise Refused("that is you; journal helper peers lists the other helpers")
        there = Record(self.record.root, peer.environment)
        message = Messages(there, actor=AGENT).create(titled(text), brief=text, peer=me.name)
        answer = f'answer with journal helper say {me.n} "<text>"'
        if not tell_in(self.record, peer.environment, peer.provider, f"helper {me.n}, {me.name}, wrote in message {message.n}: {text} - {answer}"):
            Nudges(there, actor=SYSTEM).to_primary(titled(f"helper {me.n}, {me.name}, wrote in message {message.n}"), f"{text}\n\n{answer}")
        return f"sent to {peer.name}"

    def _failed(self, failure: str) -> None:
        place = self._helping()
        text = f"My turn ended in an error, so I stopped: {failure}"
        helper = self._helper(place) if place else None
        if not helper or helper.report == text:
            return
        home = Record(self.record.root, place.launched_from)
        rows = unmarked(home, helper)
        give_back(home, rows)
        self._told(place, text, given_back(rows))

    def _helping(self):
        place = Environments(self.record, actor=SYSTEM).rows.by_title(self.record.env)
        return place if place and place.helping else None

    def _helper(self, place) -> Helper:
        return Helpers(Record(self.record.root, place.launched_from), actor=SYSTEM).load(place.owned_by(HELPER))

    def _told(self, place, text: str, given_back_text: str = "") -> None:
        home = Record(self.record.root, place.launched_from)
        row = Helpers(home, actor=SYSTEM).update(self._helper(place).n, report=text, answering=False)
        bus.defer(lambda: self._relayed(home, row, text, given_back_text))

    @staticmethod
    def _relayed(home: Record, row: Helper, text: str, given_back_text: str) -> None:
        message = Messages(home, actor=AGENT).create(titled(text), brief=f"{text}{given_back_text}", peer=row.name)
        lacking = unlanded(home, row)
        named = f"; this branch has commits {', '.join(lacking)} that your branch lacks" if lacking else ""
        tests = written_tests(home, row)
        named += f"; tests it wrote, for you to run: {', '.join(tests)}" if tests else ""
        features.FEATURES["helpers"].to_primary(home, "reported", n=row.n, name=row.name, message=message.n, branch=named, rows=[row.ref, message.ref])

    @action(network=True)
    def stop(self, n: int):
        row = self._unfinished(n, "finished")
        if self.actor == USER:
            row = self.update(n, stopped_by_user=True)
        places = Environments(self.record, actor=SYSTEM)
        place = places.rows.by_title(row.environment)
        if not place:
            raise Refused(f"helper {n}, {row.name}, has no environment left to stop")
        rows = unmarked(self.record, row)
        stopped = self._stopped(row, places, place)
        give_back(self.record, rows)
        Agents(self.record, actor=SYSTEM)._mark_primary(f"Stopped helper {n}", name=row.name, icon="bot")
        return f"{stopped}{given_back(rows)}"

    def _stopped(self, row, places: Environments, place) -> str:
        if not agent_runs(self.record, row):
            return f"helper {row.n}, {row.name}, has no agent running; finish it"
        places.stop(place.n)
        Helpers(self.record, actor=SYSTEM).update(row.n, stop_asked=time.time())
        return f"helper {row.n}, {row.name}: its agent is stopped"

    def _await_exit(self, row: Helper) -> None:
        """A stop is asked of the agent's terminal and answered at once; the agent leaves a moment later, so a finish right after waits for it."""
        until = row.stop_asked + STOP_WAIT
        while agent_runs(self.record, row) and time.time() < until:
            time.sleep(STOP_POLL)

    @action(network=True)
    def complete(self, n: int, how: str = "", **data):
        row = self._unfinished(n, "finished")
        places = Environments(self.record, actor=SYSTEM)
        place = places.rows.by_title(row.environment)
        if agent_runs(self.record, row) and time.time() - row.stop_asked < STOP_WAIT:
            self._await_exit(row)
        if agent_runs(self.record, row):
            raise Refused(f"helper {n}, {row.name}, is still running: journal helper stop {n}, then finish it")
        rows = held(self.record, row)
        give_back(self.record, rows)
        finished = super().complete(n, f"{how or 'finished; its environment is packed away'}{given_back(rows)}", **data)
        Worktrees(self.record, actor=SYSTEM)._released(row.name)
        Agents(self.record, actor=SYSTEM)._mark_primary(f"Finished helper {n}", name=row.name, icon="bot")
        bus.defer(lambda: self._packed(row, place))
        return finished

    def _packed_folder(self, title: str) -> None:
        home = Record(self.record.root, title).home
        if home.is_dir():
            attic.pack(home, f"{title}-{int(time.time())}")

    def _packed(self, row: Helper, place) -> None:
        if place:
            Environments(self.record, actor=SYSTEM).complete(place.n, "the helper finished", yes=True)
        elif row.environment:
            self._packed_folder(row.environment)
        cut = Worktrees(self.record, actor=SYSTEM)
        if row.worktree and not cut.load(int(row.worktree)).completed:
            cut.complete(int(row.worktree))


resources_module.register(Helper)
types_module.register(Helpers)
