from controllers.types import Agents
from events.agents import AgentReported
from events.status_bar import BarStale, DoingStale, UsageRead
import json
from typing import TypedDict

from expects import WHEN, Answered, Dispatches, Given, Remembered, Replied, Requested, Unchanged, Updated, at, nothing
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow
from features.status_bar.details import StatusLineDetails
from features.status_bar.handlers import BAR_EVERY, DrawTheBar, KeepUsage, NoteWhatItDoes, ReadUsage, SpotStaleBar, SpotStaleDoing
from features.status_bar.commands import ShowBar
from features.status_bar.routes import get_bar


def ran(command: str, after: float = 0, **more) -> dict:
    return {"command": command, "tool": "Bash", "at": WHEN + after, **more}


def edited(name: str, after: float = 0, **more) -> dict:
    return {"command": f"editing {name}", "tool": "Edit", "files": [name], "at": WHEN + after, "effect": "writes", **more}


def counting(name: str, after: float = 0, added: int = 0, removed: int = 0) -> dict:
    return edited(name, after, changed={"added": added, "removed": removed})


def read(name: str, after: float = 0) -> dict:
    return {"command": f"reading {name}", "tool": "Read", "files": [name], "at": WHEN + after, "effect": "reads"}


def verb(word: str) -> dict:
    return {"value": word, "color": "gray"}


def named(value: str) -> dict:
    return {"value": value, "color": "muted"}


def rolling(values: list) -> dict:
    return {"value": values, "duration": 1.0, "color": "muted"}


Said = TypedDict("Said", {"id": float, "key": str, "parts": list, "at": float, "done": bool, "for": float, "clock": bool, "hold": float, "lingers": float})


def said(after: float, key: str, parts: list, done: bool, ran_for: float, hold: float) -> Said:
    return {"id": WHEN + after, "key": key, "parts": parts, "at": WHEN + after, "done": done, "for": ran_for, "clock": False, "hold": hold, "lingers": 10.0}


def drawn(*commands: dict, **given) -> Given:
    return Given(BarStale(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"commands": list(commands)})], **given)


def doing(*commands: dict, **given) -> Given:
    return Given(DoingStale(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"commands": list(commands)})], **given)


def effecting(effect: str) -> Given:
    return doing(ran("x", effect=effect, files=["a.py"]))


def now_doing(text: str) -> Updated:
    return Updated(AgentRow(n=1), doing=text)


def rollout(resets: int) -> str:
    return json.dumps({"timestamp": "2026-10-02T10:00:00Z", "type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"total_tokens": 0}, "model_context_window": 0},
                                                                                       "rate_limits": {"primary": {"used_percent": 20, "window_minutes": 300, "resets_at": resets}}}}) + "\n"


class StatusLine(Feature):
    details = StatusLineDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_bar, expects=[Given(Requested(), rows=[AgentRow(n=1, title="claude-1")]) >> Replied(200, {"queue": []})])
        journal.commands.add("agent", ShowBar(), expects=[
            Given((Agents,)) >> Answered({"queue": []}),
            Given((Agents,), remembered={"status_bar.bar": {"queue": [{"key": "editing now.py"}]}}) >> Answered({"queue": [{"key": "editing now.py"}]}),
        ])
        journal.events.listen(AgentReported, SpotStaleBar(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(BarStale(agent=1).spaced("bar", BAR_EVERY)),
        ])
        journal.events.handle(BarStale, DrawTheBar(), expects=[
            Given(BarStale(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Remembered("bar", {"queue": []}),
            Given(BarStale(agent=1)) >> Remembered("bar", {"queue": []}),
            drawn(edited("a.vue"), edited("b.py"), edited("c.md")) >> Remembered("bar", {"queue": [
                said(0, "editing a.vue", [verb("editing"), rolling(["a.vue", "b.py", "c.md"])], False, 0, 3.0)]}),
            drawn(edited("one.py"), edited("two.py"), ran("journal todo add x", 1), ran("git commit -m x", 2), edited("three.py", 3), clock=at(WHEN + 4)) >> Remembered("bar", {"queue": [
                said(0, "editing one.py", [verb("editing"), rolling(["one.py", "two.py"])], True, 0, 2.0),
                said(1, "journalling adding todo", [verb("journalling"), named("adding"), named("todo")], True, 0, 0.0),
                said(2, "git committing changes", [verb("git"), named("committing"), named("changes")], True, 0, 0.0),
                said(3, "editing three.py", [verb("editing"), named("three.py")], False, 1, 1.0)]}),
            drawn(ran("")) >> Remembered("bar", {"queue": []}),
            drawn(read("before.py"), edited("now.py", 1), clock=at(WHEN + 2)) >> Remembered("bar", {"queue": [
                said(0, "reading before.py", [verb("reading"), named("before.py")], True, 0, 0.0),
                said(1, "editing now.py", [verb("editing"), named("now.py")], False, 1, 1.0)]}),
            drawn(ran("git add -A"), ran("git commit -m x", 1, effect="writes", done=WHEN + 2), ran("git push", 3), clock=at(WHEN + 4)) >> Remembered("bar", {"queue": [
                said(0, "git tracking files", [verb("git"), rolling(["tracking", "committing", "pushing"]), rolling(["files", "changes", "changes"])], False, 1, 3.0)]}),
            drawn(ran("journal message read 601")) >> Remembered("bar", {"queue": [
                said(0, "journalling reading message 601", [verb("journalling"), named("reading"), named("message"), named("601")], False, 0, 0.0)]}),
            drawn(counting("a.py", 0, 3, 1), counting("a.py", 1, 2), clock=at(WHEN + 2)) >> Remembered("bar", {"queue": [
                said(0, "editing a.py", [verb("editing"), named("a.py"), {"value": 5, "prefix": "+", "increments": True, "color": "green"},
                                         {"value": 1, "prefix": "-", "increments": True, "color": "red"}], False, 1, 1.0)]}),
            drawn(counting("a.py", 0, 3), counting("b.py", 1, 0, 2), clock=at(WHEN + 2)) >> Remembered("bar", {"queue": [
                said(0, "editing a.py", [verb("editing"), rolling(["a.py", "b.py"]), {"value": [3, 6], "prefix": "+", "increments": True, "color": "green", "duration": 1.0},
                                         {"value": [0, 2], "prefix": "-", "increments": True, "color": "red", "duration": 1.0}], False, 1, 2.0)]}),
            drawn(ran("x", effect="writes", files=["a.py"], made=["a.py"])) >> Remembered("bar", {"queue": [
                said(0, "creating a.py", [verb("creating"), named("a.py")], False, 0, 1.0)]}),
            drawn(ran("journal question answer 10"), ran("journal todo add 12", 1), ran("journal work log 12 x", 2), clock=at(WHEN + 3)) >> Remembered("bar", {"queue": [
                said(0, "journalling answering question 10", [verb("journalling"), rolling(["answering", "adding", "logging"]), rolling(["question", "todo", "work"]), rolling(["10", "12", "12"])], False, 1, 3.0)]}),
        ])
        journal.events.listen(AgentReported, SpotStaleDoing(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1)]) >> Dispatches(DoingStale(agent=1).spaced("doing|1", BAR_EVERY)),
        ])
        journal.events.handle(DoingStale, NoteWhatItDoes(), expects=[
            Given(DoingStale(agent=1), rows=[AgentRow(n=1, data={"doing": "Reading orchestra.js"})]) >> now_doing(""),
            Given(DoingStale(agent=1), rows=[AgentRow(n=1)]) >> Unchanged(),
            doing(edited("now.py", 1), clock=at(WHEN + 2)) >> now_doing("editing now.py"),
            doing(counting("now.py", 1, 12, 3), clock=at(WHEN + 2)) >> now_doing("editing now.py +12 -3"),
            doing(ran("journal todo")) >> now_doing("journalling listing todos"),
            doing(ran("python3 src/journal.py message read 601")) >> now_doing("journalling reading message 601"),
            doing(ran("python3 tools/build.py")) >> now_doing("running python3 build.py"),
            doing(read("a.png")) >> now_doing("viewing a.png"),
            doing(read("b.mp4")) >> now_doing("watching b.mp4"),
            doing(ran("journal nothing-known")) >> now_doing("journalling checking nothing-known"),
            doing(ran("node")) >> now_doing("running node"),
            doing(ran("bash <<EOF\necho\nEOF")) >> now_doing("running bash script"),
            effecting("writes") >> now_doing("editing a.py"),
            effecting("reads") >> now_doing("reading files"),
            effecting("deletes") >> now_doing("deleting a.py"),
            effecting("tests") >> now_doing("testing tests"),
            effecting("installs") >> now_doing("installing dependencies"),
            effecting("builds") >> now_doing("building x"),
            effecting("") >> now_doing("running x"),
        ])
        journal.events.listen(AgentReported, ReadUsage(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1)]) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="codex-1", data={"provider": "codex"})], transcript=rollout(4102444800))
                >> Dispatches(UsageRead(agent=1, usage={"windows": [{"key": "primary", "label": "5h", "used": 20.0, "minutes": 300, "resets": 4102444800}]})),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="codex-1", data={"provider": "codex"})], transcript=rollout(5)) >> Dispatches(UsageRead(agent=1, usage={"windows": []})),
        ])
        journal.events.handle(UsageRead, KeepUsage(), expects=[
            Given(UsageRead(agent=1, usage={"tokens": 1200}), rows=[AgentRow(n=1)]) >> Updated(AgentRow(n=1), usage={"tokens": 1200}),
        ])
