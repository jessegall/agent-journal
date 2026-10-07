from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.types import Environments, Messages, Nudges, Todos
from engine import bus
from engine.record import Record
from engine.sessions import Sessions
from features.agent_sessions.launch import launched, prepared, tell_in
from features.helper_worktrees.controller import Worktrees
from features.helpers.resource import Helper
from resources.base import AGENT, SYSTEM, USER, Refused, titled
from resources.types import HELPER, MergeWait, Todo
from controllers.marks import action
from engine.wording import slugged
from resources.types import EnvironmentKind


def kickoff(row, folder: Path, todo: int, handed: list[Todo]) -> str:
    return (f"You are {row.name}, a helper dispatched for one bounded job. The job: {row.title}\n\n{row.brief}\n\n"
            f"It is to-do {todo} on your own list: take it with journal todo start {todo}, keep its work log as you go, "
            f"and close it with journal todo done {todo} --how \"<what landed>\" before you report. "
            f"{handed_over(handed)}"
            f"Work only on this job, in {folder}. Commit what you change there; never push, never switch branches. "
            f"Do not write to the user, and do not write rules, facts or docs. "
            f"When the job is done, or you cannot go on, finish with journal helper report \"<what you did, what you found, what is left>\": "
            f"that is the only way your answer reaches the agent that dispatched you.")


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


def stop_helpers(record: Record) -> list[str]:
    root = record.root
    standing = [place for place in Environments(record, actor=SYSTEM).rows.standing() if place.helping and Sessions(root).holder(place.title)]
    return [Helpers(Record(root, place.launched_from), actor=SYSTEM).stop(place.owned_by(HELPER)) for place in standing]


def given_back(todos: list[Todo]) -> str:
    return f"; given back: to-do {', '.join(str(t.n) for t in todos)}" if todos else ""


def handed_over(todos: list[Todo]) -> str:
    if not todos:
        return ""
    listed = "\n".join(f"- to-do {t.n}: {t.title}" + (f" ({t.brief})" if t.brief else "") for t in todos)
    return (f"These to-dos of the agent that dispatched you are yours alone:\n{listed}\n"
            f"When a commit of yours holds one, mark it with journal helper done <n> \"<what landed>\": "
            f"it shows as done and closes once your work is taken. ")


class Helpers(Controller):
    resource = Helper

    @action(network=True)
    def dispatch(self, name: str, job: str, provider: str = "", model: str = "", brief: str = "", worktree: bool = False, checkout: str = "",
                 todos: str = "") -> str:
        row = self._dispatched(name, job, provider, model, brief, worktree, checkout, numbers_in(todos))
        return f"helper {row.n}, {name}, started on {provider} {model}; you are told when it reports"

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
        slug = slugged(name, limit=30)
        if not slug:
            raise Refused(f"a helper needs a name, such as Rhea; {name!r} has no letters to name it by")
        place = Environments(self.record, actor=SYSTEM).unused(slugged(f"{self.record.env}-{slug}", limit=30), ": finish that helper first, or choose another name")
        row = self.create(job, brief=brief, name=name, provider=provider, model=model, environment=place, checkout=str(folder) if checkout else "")
        for earlier in self.rows.standing():
            if earlier.n != row.n and earlier.environment == place:
                Controller.complete(self, earlier.n, how=f"carried on by helper {row.n} in the same environment")
        if worktree:
            given = Worktrees(self.record, actor=SYSTEM)._cut(place, helper=name)
            folder = Path(given.path)
            row = self.update(row.n, worktree=str(given.n))
        driver = DRIVERS[provider]
        home = prepared(self.record, place, f"Where helper {row.name} works on {job}", row.ref, folder, EnvironmentKind.HELPER)
        todo = Todos(home, actor=SYSTEM).create(job, brief=brief)
        listed = Todos(self.record, actor=SYSTEM)
        for given in handed:
            listed.assign(given.n, to=row.ref)
        try:
            launched(self.record, place, provider, driver.prompted(["--model", model], kickoff(row, folder, todo.n, handed)), folder)
        except Exception:
            give_back(self.record, handed)
            raise
        return row

    def _handable(self, numbers: tuple[int, ...]) -> list[Todo]:
        listed = Todos(self.record, actor=SYSTEM)
        rows = [listed.load(n) for n in numbers]
        for row in rows:
            if row.completed:
                raise Refused(f"todo {row.n} is already done; hand a helper only open to-dos")
            if row.assigned:
                raise Refused(f"todo {row.n} is already assigned to {row.assigned}")
        return rows

    @action
    def done(self, todo: int, how: str) -> str:
        place = self._helping()
        if not place:
            raise Refused("only a helper marks a to-do it was handed as done; the agent that dispatched it closes its own with journal todo done")
        helper = self._helper(place)
        home = Record(self.record.root, place.launched_from)
        listed = Todos(home, actor=SYSTEM)
        row = listed.load(todo)
        if row.assigned != helper.ref:
            raise Refused(f"todo {row.n} was not handed to you; mark only the to-dos your kickoff names")
        if not helper.worktree:
            listed.complete(row.n, how)
            return f"todo {row.n} is done"
        listed.update(row.n, pending=MergeWait(how, helper.worktree).to_json())
        return f"todo {row.n} shows as done; it closes once your work is taken"

    @staticmethod
    def _checkout(project: Path, path: str) -> Path:
        folder = (project / path).resolve()
        if folder != project and project not in folder.parents:
            raise Refused(f"--checkout names a checkout inside the project, {project}; {folder} is outside it")
        if not (folder / ".git").exists():
            raise Refused(f"{folder} is not a git checkout: --checkout names the folder that holds .git, such as platform")
        return folder

    @action(network=True)
    def say(self, n: int, text: str) -> str:
        row = self._unfinished(n, "finished")
        if not tell_in(self.record, row.environment, row.provider, text):
            raise Refused(f"helper {n}, {row.name}, is not running; dispatch it again to go on")
        return f"sent to {row.name}"

    @action
    def report(self, text: str) -> str:
        place = self._helping()
        if not place:
            raise Refused("only a helper reports, from the environment it was dispatched into")
        self._told(place, text)
        return "reported; the agent that dispatched you has it"

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
        row = Helpers(home, actor=SYSTEM).update(self._helper(place).n, report=text)
        bus.defer(lambda: self._relayed(home, row, text, given_back_text))

    @staticmethod
    def _relayed(home: Record, row: Helper, text: str, given_back_text: str) -> None:
        told = Messages(home, actor=AGENT).create(titled(text), brief=f"{text}{given_back_text}", peer=row.name)
        Nudges(home, actor=SYSTEM).to_primary(titled(f"helper {row.n}, {row.name}, reported in message {told.n}"),
                                               f"read it, then journal helper finish {row.n} once its work is taken or dropped")

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
        stopped = places.stop(place.n)
        give_back(self.record, rows)
        return f"{stopped}{given_back(rows)}"

    @action(network=True)
    def complete(self, n: int, how: str = "", **data):
        row = self._unfinished(n, "finished")
        places = Environments(self.record, actor=SYSTEM)
        place = places.rows.by_title(row.environment)
        if Sessions(self.record.root).holder(row.environment):
            raise Refused(f"helper {n}, {row.name}, is still running: journal helper stop {n}, then finish it")
        rows = held(self.record, row)
        finished = super().complete(n, f"{how or 'finished; its environment is packed away'}{given_back(rows)}", **data)
        give_back(self.record, rows)
        bus.defer(lambda: self._packed(row, place))
        return finished

    def _packed(self, row: Helper, place) -> None:
        if place:
            Environments(self.record, actor=SYSTEM).complete(place.n, "the helper finished", yes=True)
        cut = Worktrees(self.record, actor=SYSTEM)
        if row.worktree and not cut.load(int(row.worktree)).completed:
            cut.complete(int(row.worktree))


resources_module.register(Helper)
types_module.register(Helpers)
