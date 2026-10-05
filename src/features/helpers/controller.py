from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.types import Environments, Messages, Nudges, Todos
from engine.record import Record
from engine.sessions import Sessions
from features.agent_sessions.launch import launched, prepared, tell_in
from features.helper_worktrees.controller import Worktrees
from features.helpers.resource import Helper
from resources.base import AGENT, SYSTEM, USER, Refused, titled
from resources.types import HELPER
from controllers.marks import action
from engine.wording import slugged


def kickoff(row, folder: Path, todo: int) -> str:
    return (f"You are {row.name}, a helper dispatched for one bounded job. The job: {row.title}\n\n{row.brief}\n\n"
            f"It is to-do {todo} on your own list: take it with journal todo start {todo}, keep its work log as you go, "
            f"and close it with journal todo done {todo} --how \"<what landed>\" before you report. "
            f"Work only on this job, in {folder}. Commit what you change there; never push, never switch branches. "
            f"Do not write to the user, and do not write rules, facts or docs. "
            f"When the job is done, or you cannot go on, finish with journal helper report \"<what you did, what you found, what is left>\": "
            f"that is the only way your answer reaches the agent that dispatched you.")


class Helpers(Controller):
    resource = Helper

    @action(network=True)
    def dispatch(self, name: str, job: str, provider: str = "", model: str = "", brief: str = "", worktree: bool = False) -> str:
        row = self._dispatched(name, job, provider, model, brief, worktree)
        return f"helper {row.n}, {name}, started on {provider} {model}; you are told when it reports"

    def _dispatched(self, name: str, job: str, provider: str, model: str, brief: str = "", worktree: bool = False):
        from providers import DRIVERS
        if provider not in DRIVERS:
            raise Refused(f"a helper runs on one of {', '.join(DRIVERS)}, not {provider!r}")
        if not model.strip():
            raise Refused("a helper's model is always named: --model <model>")
        slug = slugged(name, limit=30)
        if not slug:
            raise Refused(f"a helper needs a name, such as Rhea; {name!r} has no letters to name it by")
        place = Environments(self.record, actor=SYSTEM).unused(slugged(f"{self.record.env}-{slug}", limit=30), ": finish that helper first, or choose another name")
        row = self.create(job, brief=brief, name=name, provider=provider, model=model, environment=place)
        folder = self.record.root.resolve().parent
        if worktree:
            given = Worktrees(self.record, actor=SYSTEM)._cut(place, helper=name)
            folder = Path(given.path)
            row = self.update(row.n, worktree=str(given.n))
        driver = DRIVERS[provider]
        home = prepared(self.record, place, f"Where helper {row.name} works on {job}", row.ref)
        todo = Todos(home, actor=SYSTEM).create(job, brief=brief)
        launched(self.record, place, provider, driver.prompted(["--model", model], kickoff(row, folder, todo.n)), folder)
        return row

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
        if place and self._helper(place).report != text:
            self._told(place, text)

    def _helping(self):
        place = Environments(self.record, actor=SYSTEM)._titled(self.record.env)
        return place if place and place.helping else None

    def _helper(self, place) -> Helper:
        return Helpers(Record(self.record.root, place.launched_from), actor=SYSTEM).load(place.owned_by(HELPER))

    def _told(self, place, text: str) -> None:
        home = Record(self.record.root, place.launched_from)
        row = Helpers(home, actor=SYSTEM).update(self._helper(place).n, report=text)
        told = Messages(home, actor=AGENT).create(titled(text), brief=text, peer=row.name)
        Nudges(home, actor=SYSTEM)._to_primary(titled(f"helper {row.n}, {row.name}, reported in message {told.n}"),
                                               f"read it, then journal helper finish {row.n} once its work is taken or dropped")

    @action(network=True)
    def stop(self, n: int):
        row = self._unfinished(n, "finished")
        if self.actor == USER:
            row = self.update(n, stopped_by_user=True)
        places = Environments(self.record, actor=SYSTEM)
        place = places._titled(row.environment)
        if not place:
            raise Refused(f"helper {n}, {row.name}, has no environment left to stop")
        return places.stop(place.n)

    @action(network=True)
    def complete(self, n: int, how: str = "", **data):
        row = self._unfinished(n, "finished")
        places = Environments(self.record, actor=SYSTEM)
        place = places._titled(row.environment)
        if Sessions(self.record.root).holder(row.environment):
            raise Refused(f"helper {n}, {row.name}, is still running: journal helper stop {n}, then finish it")
        if place:
            places.complete(place.n, "the helper finished", yes=True)
        cut = Worktrees(self.record, actor=SYSTEM)
        if row.worktree and not cut.load(int(row.worktree)).completed:
            cut.complete(int(row.worktree))
        return super().complete(n, how or "finished; its environment is packed away", **data)


resources_module.register(Helper)
types_module.register(Helpers)
