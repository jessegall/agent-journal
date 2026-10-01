import json
import os
import re
import subprocess
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import features
import features.helpers.controller as helping
from engine.record import Record
from engine.viewer import launch
from features.helper_worktrees.controller import Worktrees
from features.work_modes.modes import pick
from providers import DRIVERS, PROVIDERS
from resources.base import AGENT, SYSTEM, USER

NUMBER = re.compile(r'"n": (\d+)')
SKILLS = re.compile(r"Skill: ([\w-]+)|skills/([\w-]+)/SKILL\.md")
MAIN = "main"
SECOND = 1.0
OPENING = {("todo", "start"), ("work", "start"), ("work", "resume")}
STARTING_SKILLS = ("journal", "journal-chat-etiquette", "journal-todos")


class Refusal(Exception):
    pass


@dataclass(frozen=True)
class Fork:
    question: int
    rows: dict[str, int]


@dataclass(frozen=True)
class Seat:
    session: str
    provider: str = "claude"
    env: str = ""
    cwd: Path | None = None


@dataclass(frozen=True)
class Call:
    name: str
    given: dict


def stamp() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


class Claude:
    def __init__(self, path: Path, seat: Seat):
        self.path = path
        self.seat = seat
        self.last: str | None = None

    def wrote(self, target: Path, text: str) -> Call:
        return Call("Edit" if target.exists() else "Write", {"file_path": str(target), "content": text})

    def ran(self, command: str) -> Call:
        return Call("Bash", {"command": command})

    def loads(self, skills: list[str]) -> list[Call]:
        return [Call("Skill", {"skill": skill}) for skill in skills]

    def appended(self, row: dict) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("a") as out:
            out.write(json.dumps(row) + "\n")

    def kept(self, kind: str, content) -> None:
        made = str(uuid.uuid4())
        self.appended({"type": kind, "uuid": made, "parentUuid": self.last, "sessionId": self.seat.session, "isSidechain": False,
                       "userType": "external", "cwd": str(self.seat.cwd or ""), "timestamp": stamp(), "message": {"role": kind, "content": content}})
        self.last = made

    def prompted(self, text: str) -> None:
        self.kept("user", text)

    def used(self, call: Call) -> None:
        self.kept("assistant", [{"type": "tool_use", "id": f"toolu_{uuid.uuid4().hex[:24]}", "name": call.name, "input": call.given}])


class Codex(Claude):
    def wrote(self, target: Path, text: str) -> Call:
        added = "".join(f"+{line}\n" for line in text.splitlines())
        if not target.exists():
            return Call("apply_patch", {"input": f"*** Begin Patch\n*** Add File: {target}\n{added}*** End Patch\n"})
        removed = "".join(f"-{line}\n" for line in target.read_text().splitlines())
        return Call("apply_patch", {"input": f"*** Begin Patch\n*** Update File: {target}\n@@\n{removed}{added}*** End Patch\n"})

    def ran(self, command: str) -> Call:
        return Call("exec_command", {"cmd": command})

    def loads(self, skills: list[str]) -> list[Call]:
        return [self.ran(" && ".join(f"sed -n '1,240p' .agents/skills/{skill}/SKILL.md" for skill in skills))]

    def prompted(self, text: str) -> None:
        self.appended({"timestamp": stamp(), "type": "response_item",
                       "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": text}]}})

    def used(self, call: Call) -> None:
        script = f"const r = await tools.{call.name}({json.dumps(call.given)}); text(r.output);"
        self.appended({"timestamp": stamp(), "type": "response_item",
                       "payload": {"type": "custom_tool_call", "id": f"ctc_{uuid.uuid4().hex}", "call_id": f"call_{uuid.uuid4().hex[:24]}", "name": "exec", "input": script}})


HANDS = {"claude": (Claude, ".claude/transcripts"), "codex": (Codex, ".codex/sessions")}


@dataclass
class Session:
    project: Path
    pace: float = 1.0
    name: str = "demo"
    sleepers: dict[str, subprocess.Popen] = field(default_factory=dict)
    hands: dict[str, Claude] = field(default_factory=dict)
    alive: list[str] = field(default_factory=list)

    def __post_init__(self):
        self.root = self.project / ".journal"
        self.main = Seat(f"{self.name}-main")
        self.revived(self.alive)
        features.load(self.root)
        helping.launched = lambda record, name, provider, args, cwd: name
        for driver in DRIVERS.values():
            driver.enter = lambda self, text: True
        self.url, failed = launch(self.root, self.project)
        if not self.url:
            raise Refusal(f"the journal server did not start ({failed}): see {self.root / 'runtime' / 'viewer.log'}")

    def wait(self, seconds: float) -> None:
        time.sleep(seconds * self.pace)

    def journal(self, *args: str, actor: str = AGENT, seat: Seat | None = None) -> str:
        seat = seat or self.main
        place = ["--env", seat.env] if seat.env else []
        done = subprocess.run([str(self.root / "journal"), *place, *args], cwd=seat.cwd or self.project, capture_output=True, text=True, timeout=60,
                              env={**os.environ, "JOURNAL_ACTOR": actor, "JOURNAL_SESSION": seat.session, "JOURNAL_ENV": seat.env})
        out = (done.stdout + done.stderr).strip()
        if out.startswith("!") or done.returncode:
            raise Refusal(f"journal {' '.join(args[:3])} was refused: {out[:400]}")
        if tuple(args[:2]) in OPENING:
            time.sleep(SECOND)
        return out

    def made(self, *args: str, actor: str = AGENT, seat: Seat | None = None) -> int:
        return int(NUMBER.search(self.journal(*args, actor=actor, seat=seat)).group(1))

    def record(self, env: str = MAIN) -> Record:
        return Record(self.root, env)

    def pid(self, seat: Seat) -> int:
        if seat == self.main:
            return os.getpid()
        if seat.session not in self.sleepers:
            self.sleepers[seat.session] = subprocess.Popen(["sleep", "3600"])
        return self.sleepers[seat.session].pid

    def hand(self, seat: Seat) -> Claude:
        kind, folder = HANDS[seat.provider]
        return self.hands.setdefault(seat.session, kind(self.project / folder / f"{seat.session}.jsonl", seat))

    def hook(self, event: str, seat: Seat | None = None, call: Call | None = None, **extra) -> None:
        seat = seat or self.main
        reason = self.held(event, seat, call, extra)
        wanted = [first or second for first, second in SKILLS.findall(reason)]
        if wanted and event == "PreToolUse":
            self.loaded(seat, wanted)
            reason = self.held(event, seat, call, extra)
        if reason:
            raise Refusal(f"{event} {json.dumps(call.given)[:160] if call else ''} was held: {reason[:400]}")

    def held(self, event: str, seat: Seat, call: Call | None, extra: dict) -> str:
        hand = self.hand(seat)
        if event == "UserPromptSubmit":
            hand.prompted(extra["prompt"])
        if event == "PreToolUse":
            hand.used(call)
        tool = {"tool_name": call.name, "tool_input": call.given} if call else {}
        payload = {"hook_event_name": event, "session_id": seat.session, "cwd": str(seat.cwd or self.project), "transcript_path": str(hand.path), **tool, **extra}
        query = urlencode({"root": str(self.root), "pid": self.pid(seat), "env": seat.env})
        asked = Request(f"{self.url}api/hook/{seat.provider}?{query}", json.dumps(payload).encode(), {"Content-Type": "application/json"})
        try:
            with urlopen(asked, timeout=30) as got:
                replied = json.loads(got.read() or b"{}")
        except HTTPError as refused:
            replied = json.loads(refused.read() or b"{}")
        return replied.get("reason", "") if PROVIDERS[seat.provider]().refused(replied) else ""

    def loaded(self, seat: Seat, skills: list[str]) -> None:
        time.sleep(SECOND)
        for call in self.hand(seat).loads(skills):
            self.held("PreToolUse", seat, call, {})
            self.held("PostToolUse", seat, call, {"tool_response": {"success": True}})

    def started(self, seat: Seat | None = None) -> None:
        self.hook("SessionStart", seat, source="startup")
        self.loaded(seat or self.main, list(STARTING_SKILLS))
        self.wait(1)

    def ended(self, seat: Seat) -> None:
        self.hook("SessionEnd", seat, reason="exit")
        gone = self.sleepers.pop(seat.session)
        gone.kill()
        gone.wait()
        self.wait(0.5)

    def revived(self, alive: list[str]) -> None:
        for session in alive:
            kept = self.root / "runtime" / "sessions" / session / "session.json"
            self.sleepers[session] = subprocess.Popen(["sleep", "3600"])
            kept.write_text(json.dumps({**json.loads(kept.read_text()), "pid": self.sleepers[session].pid}))

    def write(self, path: str, text: str, seat: Seat | None = None) -> None:
        seat = seat or self.main
        target = (seat.cwd or self.project) / path
        call = self.hand(seat).wrote(target, text)
        self.hook("PreToolUse", seat, call)
        self.wait(1.0)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text)
        self.hook("PostToolUse", seat, call, tool_response={"success": True})
        self.wait(0.6)

    def shell(self, command: str, seat: Seat | None = None) -> str:
        seat = seat or self.main
        call = self.hand(seat).ran(command)
        self.hook("PreToolUse", seat, call)
        done = subprocess.run(command, shell=True, cwd=seat.cwd or self.project, capture_output=True, text=True, timeout=120)
        if done.returncode:
            raise Refusal(f"{command} failed: {(done.stdout + done.stderr)[-400:]}")
        self.wait(1.0)
        self.hook("PostToolUse", seat, call, tool_response={"stdout": done.stdout[-400:]})
        self.wait(0.4)
        return done.stdout

    def user(self, text: str) -> int:
        n = self.made("message", "create", text[:70].rstrip(".,!?").replace(":", ","), "--brief", text, actor=USER)
        self.wait(1.5)
        self.journal("message", "read", str(n))
        self.hook("UserPromptSubmit", prompt=text)
        return n

    def reply(self, to: int, text: str) -> None:
        self.journal("message", "reply", str(to), text)
        self.wait(1.0)

    def say(self, text: str) -> None:
        self.journal("message", "create", text.split(".")[0][:70].replace(":", ","), "--brief", text)
        self.wait(1.0)

    def ask(self, title: str, about: str, options: dict[str, str]) -> int:
        listed = json.dumps([{"title": label, "description": text} for label, text in options.items()])
        n = self.made("question", "ask", title, "--set", f"about={about}", "--set", f"options={listed}")
        self.stop()
        return n

    def answered(self, question: int, how: str) -> None:
        self.journal("question", "answer", str(question), "--how", how, actor=USER)
        self.hook("UserPromptSubmit", prompt=how)
        self.wait(1.0)

    def approve(self, plan: int) -> None:
        self.journal("plan", "approve", str(plan), actor=USER)
        self.hook("UserPromptSubmit", prompt="approved")
        self.wait(1.0)

    def mode(self, mode: str) -> None:
        pick(self.record(), mode, USER)
        self.wait(1.0)

    def stop(self) -> None:
        self.hook("Stop")
        self.wait(2.5)

    def helpers(self, actor: str = AGENT) -> helping.Helpers:
        return helping.Helpers(self.record(), actor=actor, session=self.main.session)

    def dispatch(self, name: str, job: str, provider: str, model: str, brief: str, worktree: bool = False) -> int:
        row = self.helpers()._dispatched(name, job, provider, model, brief, worktree)
        self.wait(1.0)
        return row.n

    def helper_seat(self, name: str, provider: str, worktree: bool = False) -> Seat:
        env = "main-" + "-".join(name.lower().split()[:2])
        cwd = Path(Worktrees(self.record(), actor=SYSTEM)._titled(env, standing=True).path) if worktree else self.project
        return Seat(f"{self.name}-{name.split()[0].lower()}", provider, env, cwd)

    def worktree(self, seat: Seat) -> int:
        return Worktrees(self.record(), actor=SYSTEM)._titled(seat.env, standing=True).n

    def finish(self) -> None:
        for sleeper in self.sleepers.values():
            sleeper.kill()
            sleeper.wait()
        self.sleepers.clear()
