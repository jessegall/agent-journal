import json
import os
import re
import subprocess
import sys
import threading
import time
import uuid
from dataclasses import dataclass, field, replace
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import features
import features.helpers.controller as helping
from engine import typist
from engine.record import Record
from engine.sessions import ACTIVE_ENV
from engine.viewer import launch, running
from features.helper_worktrees.controller import Worktrees
from features.work_modes.modes import pick
from providers import DRIVERS, PROVIDERS
from resources.base import AGENT, SYSTEM, USER

NUMBER = re.compile(r'"n": (\d+)')
SKILLS = re.compile(r"Skill: ([\w-]+)|skills/([\w-]+)/SKILL\.md")
MAIN = "main"
CHANNEL = "notifications/claude/channel"
SECOND = 1.0
SERVER_STARTS = 30.0
THINKING, EDITING, REPLYING = 2.0, 2.5, 4.0
OPENING = {("todo", "start"), ("work", "start"), ("work", "resume")}
WRITING_A_REPORT = "Writing a report"
BUILDING_A_PLAN = "Building a plan"
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
    agent: str = ""


@dataclass(frozen=True)
class Phase:
    title: str
    when: str
    rows: tuple[tuple[str, str], ...]


@dataclass(frozen=True)
class Planned:
    n: int
    rows: list[int]


@dataclass(frozen=True)
class Call:
    name: str
    given: dict
    id: str = field(default_factory=lambda: f"toolu_{uuid.uuid4().hex[:24]}")


@dataclass(frozen=True)
class Subagent:
    seat: Seat
    dispatch: Call


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
        self.appended({"type": kind, "uuid": made, "parentUuid": self.last, "sessionId": self.seat.session, "isSidechain": bool(self.seat.agent),
                       **({"agentId": self.seat.agent} if self.seat.agent else {}),
                       "userType": "external", "cwd": str(self.seat.cwd or ""), "timestamp": stamp(), "message": {"role": kind, "content": content}})
        self.last = made

    def prompted(self, text: str) -> None:
        self.kept("user", text)

    def channeled(self, text: str) -> None:
        self.kept("user", f'<channel source="journal" from="journal">\n{text}\n</channel>')

    def used(self, call: Call) -> None:
        self.kept("assistant", [{"type": "tool_use", "id": call.id, "name": call.name, "input": call.given}])

    def returned(self, call: Call, text: str) -> None:
        self.kept("user", [{"type": "tool_result", "tool_use_id": call.id, "content": text}])


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
        self.terminal = typist.listen(self.root, self.main.session)
        self.channel = subprocess.Popen([sys.executable, str(self.root / "src" / "channel.py"), str(self.root)], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                        text=True, env={**os.environ, ACTIVE_ENV: "1"})
        self.channel.stdin.write(json.dumps({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}}) + "\n")
        self.channel.stdin.flush()
        threading.Thread(target=self.listened, daemon=True).start()
        threading.Thread(target=self.drained, daemon=True).start()
        features.load(self.root)
        helping.launched = lambda record, name, provider, args, cwd: name
        for driver in DRIVERS.values():
            driver.enter = lambda self, text: True
        self.url = self.served()

    def served(self) -> str:
        url, failed = launch(self.root, self.project)
        until = time.time() + SERVER_STARTS
        while not url and failed is None and time.time() < until:
            time.sleep(0.5)
            url = running(self.root)
        if not url:
            raise Refusal(f"the journal server did not start ({failed}): see {self.root / 'runtime' / 'viewer.log'}")
        return url

    def listened(self) -> None:
        for line in self.channel.stdout:
            told = json.loads(line)
            if told.get("method") == CHANNEL:
                self.hand(self.main).channeled(told["params"]["content"])

    def drained(self) -> None:
        while self.channel.poll() is None:
            try:
                typist.receive(self.terminal)
            except OSError:
                return
            time.sleep(0.2)

    def wait(self, seconds: float) -> None:
        time.sleep(seconds * self.pace)

    def journal(self, *args: str, actor: str = AGENT, seat: Seat | None = None) -> str:
        seat = seat or self.main
        if actor == AGENT:
            self.wait(THINKING)
        place = ["--env", seat.env] if seat.env else []
        done = subprocess.run([str(self.root / "journal"), *place, *args], cwd=seat.cwd or self.project, capture_output=True, text=True, timeout=60,
                              env={**os.environ, "JOURNAL_ACTOR": actor, "JOURNAL_SESSION": seat.session, "JOURNAL_ENV": seat.env})
        out = (done.stdout + done.stderr).strip()
        if out.startswith("!") or done.returncode:
            raise Refusal(f"journal {' '.join(args[:3])} was refused: {out[:400]}")
        if tuple(args[:2]) in OPENING:
            time.sleep(SECOND)
        return out

    def sequence(self, title: str) -> int:
        return next(int(line.split()[0]) for line in self.journal("sequence", "all").splitlines() if line.split(None, 1)[1:] == [title])

    def follow(self, title: str, about: str, seat: Seat | None = None) -> None:
        self.journal("sequence", "follow", str(self.sequence(title)), "--about", about, seat=seat)
        self.wait(0.5)

    def onward(self, title: str, about: str, seat: Seat | None = None) -> None:
        self.journal("sequence", "next", str(self.sequence(title)), "--about", about, seat=seat)
        self.wait(0.5)

    def planned(self, title: str, goal: str, phases: list[Phase]) -> Planned:
        n = self.made("plan", "create", title, "--set", f"goal={goal}")
        about = f"plan:{n}"
        self.follow(BUILDING_A_PLAN, about)
        self.onward(BUILDING_A_PLAN, about)
        self.follow(BUILDING_A_PLAN, about)
        for phase in phases:
            self.journal("plan", "phase", str(n), phase.title, "--when", phase.when)
        self.onward(BUILDING_A_PLAN, about)
        self.follow(BUILDING_A_PLAN, about)
        self.journal("plan", "stage", str(n), "todos")
        rows = []
        for at, phase in enumerate(phases, start=1):
            filed = [self.made("todo", "create", row, "--brief", brief) for row, brief in phase.rows]
            self.journal("plan", "todos", str(n), str(at), *map(str, filed))
            rows += filed
        self.onward(BUILDING_A_PLAN, about)
        self.follow(BUILDING_A_PLAN, about)
        self.journal("plan", "ready", str(n))
        self.onward(BUILDING_A_PLAN, about)
        return Planned(n, rows)

    def reported(self, title: str, brief: str, parts: dict[str, str], links: list[str], conclusion: str) -> int:
        n = self.made("report", "create", title, "--brief", brief)
        about = f"report:{n}"
        self.follow(WRITING_A_REPORT, about)
        for part in parts:
            self.journal("report", "section", str(n), part, "Being written.")
        self.onward(WRITING_A_REPORT, about)
        self.follow(WRITING_A_REPORT, about)
        for part, body in parts.items():
            self.journal("report", "section", str(n), part, body)
            self.wait(1.5)
        self.onward(WRITING_A_REPORT, about)
        self.finished(WRITING_A_REPORT, "report", n, links, conclusion)
        return n

    def finished(self, sequence: str, kind: str, n: int, links: list[str], conclusion: str) -> None:
        about = f"{kind}:{n}"
        self.follow(sequence, about)
        self.journal("collection", "all")
        self.onward(sequence, about)
        self.follow(sequence, about)
        for row in links:
            self.journal(kind, "link", str(n), row)
        self.onward(sequence, about)
        self.follow(sequence, about)
        self.onward(sequence, about)
        self.follow(sequence, about)
        self.say(f"{conclusion}\n\n{kind} {n}")
        self.onward(sequence, about)

    def made(self, *args: str, actor: str = AGENT, seat: Seat | None = None) -> int:
        return int(NUMBER.search(self.journal(*args, actor=actor, seat=seat)).group(1))

    def record(self, env: str = MAIN) -> Record:
        return Record(self.root, env)

    def pid(self, seat: Seat) -> int:
        if seat.session == self.main.session:
            return os.getpid()
        if seat.session not in self.sleepers:
            self.sleepers[seat.session] = subprocess.Popen(["sleep", "3600"])
        return self.sleepers[seat.session].pid

    def hand(self, seat: Seat) -> Claude:
        kind, folder = HANDS[seat.provider]
        main = self.project / folder / f"{seat.session}.jsonl"
        path = main.with_suffix("") / "subagents" / f"agent-{seat.agent}.jsonl" if seat.agent else main
        return self.hands.setdefault(f"{seat.session}:{seat.agent}", kind(path, seat))

    def dispatched(self, name: str, task: str, kind: str, model: str, prompt: str) -> Subagent:
        call = Call("Agent", {"description": f"{name}: {task}", "subagent_type": kind, "model": model, "prompt": prompt})
        self.wait(THINKING)
        self.hook("PreToolUse", self.main, call)
        seat = replace(self.main, agent=uuid.uuid4().hex[:17])
        meta = self.hand(seat).path.with_name(f"agent-{seat.agent}.meta.json")
        meta.parent.mkdir(parents=True, exist_ok=True)
        meta.write_text(json.dumps({"toolUseId": call.id, "agentType": kind, "description": call.given["description"]}))
        self.hook("SubagentStart", seat, agent_type=kind)
        self.hand(seat).prompted(prompt)
        self.wait(1.0)
        return Subagent(seat, call)

    def came_back(self, subagent: Subagent, text: str) -> None:
        self.hook("SubagentStop", subagent.seat, agent_type=subagent.dispatch.given["subagent_type"], last_assistant_message=text)
        self.hand(self.main).returned(subagent.dispatch, text)
        self.hook("PostToolUse", self.main, subagent.dispatch, tool_response={"content": text})
        self.wait(1.0)

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
        transcript = self.hand(replace(seat, agent="")).path
        named = {"agent_id": seat.agent} if seat.agent else {}
        payload = {"hook_event_name": event, "session_id": seat.session, "cwd": str(seat.cwd or self.project), "transcript_path": str(transcript), **named, **tool, **extra}
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
        self.wait(EDITING)
        self.hook("PreToolUse", seat, call)
        self.wait(1.0)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text)
        self.hook("PostToolUse", seat, call, tool_response={"success": True})
        self.wait(0.6)

    def shell(self, command: str, seat: Seat | None = None) -> str:
        seat = seat or self.main
        call = self.hand(seat).ran(command)
        self.wait(EDITING)
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
        self.wait(REPLYING)
        self.journal("message", "reply", str(to), text)
        self.wait(1.0)

    def say(self, text: str) -> None:
        self.wait(REPLYING)
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
        self.channel.kill()
        self.channel.wait()
        self.terminal.close()
        typist.path(self.root, self.main.session).unlink(missing_ok=True)
        for sleeper in self.sleepers.values():
            sleeper.kill()
            sleeper.wait()
        self.sleepers.clear()
