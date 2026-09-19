import json
import re
import shutil
import time
from abc import ABC, abstractmethod
from pathlib import Path

from engine.transcript import Turn
from providers.payload import Hook
from resources.base import Refused
from resources.types import AgentRow, COMMAND, RUNNING

WRITES = ("Edit", "Write", "MultiEdit", "NotebookEdit")
WRITING_COMMANDS = re.compile(r"(^|[;&|]\s*)(rm|mv|cp|git (commit|push|rm|mv)|sed -i|tee|touch|mkdir|npm install|pip install)\b|(?<![\d&])>>?\s*(?!/dev/null|&)\S")
RING = 12
JOURNAL_DIR = ".journal"
CHANGING = ("writes", "deletes")
START = r"(?:^|[;&|(]\s*|\b(?:do|then)\s+)"
EFFECTS = (
    ("tests", re.compile(START + r"(?:\S*[Pp]ython[\d.]*\s+(?:-m\s+)?\S*tests?/\S*|pytest|npm (?:run )?test|npx (?:vitest|jest)|vitest|jest|go test|cargo test|phpunit|php artisan test|dotnet test|mvn\b[^;&|]*\btest|\S*gradlew?\b[^;&|]*\btest|(?:bundle exec )?rspec|mix test)\b")),
    ("tests", re.compile(r"(?=.*\btest_)(?=.*\b[Pp]ython[\d.]*\s+\"?\$\w)", re.S)),
    ("deletes", re.compile(START + r"(?:rm|rmdir|unlink|git rm)\s")),
    ("writes", re.compile(START + r"(?:perl\s+-\w*i|sed\s+-i)|\.write_text\(|\.write\(|open\([^)]*,\s*(?:mode=)?['\"][wa]b?\+?['\"]")),
    ("reads", re.compile(r"^\s*(?:cd \S+\s*(?:&&|;)\s*)?(?:cat|head|tail|less|grep|rg|sed -n|wc|ls|find|tree|stat)\b")),
)
PASSED = re.compile(r"\b(\d+) passed\b")
FAILED = re.compile(r"\b(\d+) failed\b")
FAILING = re.compile(r"\bfiles failing: (\d+)")
PHPUNIT_OK = re.compile(r"^OK \((\d+) tests?", re.M)
DOTNET = re.compile(r"\bFailed:\s*(\d+),\s*Passed:\s*(\d+)")
EXAMPLES = re.compile(r"\b(\d+) (?:examples?|tests?), (\d+) failures?")
TALLY = re.compile(r"\bTests(?: run)?: (\d+),.*$", re.M)
TALLY_FAILED = re.compile(r"\b(?:Failures|Errors): (\d+)")
QUOTED = re.compile(r'"(?:[^"\\]|\\.)*"' + r"|'[^']*'")
JOURNAL_CALL = re.compile(r"(^|[;&|(]\s*|\$\()\S*journal(?:\.py)?\s(?:\"(?:[^\"\\]|\\.)*\"|'[^']*'|\d*>&\d|[^;&|)\n])*")


class Provider(ABC):
    name = ""
    question_tools = frozenset()
    briefing_file = ""
    skill_home = ""
    link_skills = False
    retired_skill_homes = ()
    controls = {"groups": [], "note": "This CLI does not expose model controls."}
    usage_note = "This CLI does not expose plan usage."

    @classmethod
    def control_options(cls, current_model: str = "") -> dict:
        return cls.controls

    @classmethod
    def control_choice(cls, action: str, value: str, current_model: str = "") -> dict:
        configured = cls.control_options(current_model)
        group = next((group for group in configured.get("groups", []) if group["key"] == action), None)
        selected = next((item for item in (group or {}).get("choices", []) if item["value"] == value), None)
        if not selected:
            raise Refused(f"{cls.name or 'this agent'} does not support {action} {value!r}")
        return {"action": action, **selected}

    @abstractmethod
    def config(self, project: Path) -> Path: ...

    @abstractmethod
    def wiring(self, command: str) -> dict: ...

    def compacted(self, hook: Hook) -> bool:
        return False

    def response(self, event: str = "", text: str = "", blocked: str = "") -> dict:
        if blocked:
            return {"decision": "block", "reason": blocked}
        return {"hookSpecificOutput": {"hookEventName": event, "additionalContext": text}} if text else {}

    def refused(self, response: dict) -> bool:
        return response.get("decision") == "block"

    def writes(self, hook: Hook) -> bool:
        if hook.tool.name in WRITES:
            return self.in_project(hook.tool.file_path, hook.cwd)
        return hook.tool.name == "Bash" and any(name in CHANGING for name in self.effects(hook.command))

    def in_project(self, path: str, cwd: str) -> bool:
        if not path or not cwd:
            return True
        project = Path(cwd).resolve()
        target = (project / path).resolve()
        return project in target.parents and JOURNAL_DIR not in target.relative_to(project).parts[:1]

    def shell(self, row, hook: Hook) -> dict:
        doing = hook.tool.doing.strip()[:400]
        running = dict(row.running)
        before = {k: v for k, v in running.items() if k in (RUNNING.what, RUNNING.tool, RUNNING.at, RUNNING.done, RUNNING.effect, RUNNING.changed, RUNNING.result)}
        if hook.event == "UserPromptSubmit":
            return {AgentRow.running: {RUNNING.before: before} if before.get(RUNNING.done) else {}, AgentRow.commands: list(row.commands)}
        if hook.event == "PreToolUse" and doing:
            now = time.time()
            effect = self.effect(hook)
            running = {RUNNING.what: doing, RUNNING.tool: hook.tool.name, RUNNING.at: now, **({RUNNING.effect: effect} if effect else {}),
                       **({RUNNING.before: before} if before.get(RUNNING.done) else {})}
            return {AgentRow.running: running, AgentRow.commands: (list(row.commands) + [{COMMAND.what: doing, COMMAND.tool: hook.tool.name, COMMAND.at: now,
                                                                                          **({COMMAND.effect: effect} if effect else {})}])[-RING:]}
        if running and not running.get(RUNNING.done):
            running[RUNNING.done] = time.time()
            result = self.test_result(hook) if running.get(RUNNING.effect) == "tests" else None
            if result:
                running[RUNNING.result] = result
        return {AgentRow.running: running, AgentRow.commands: list(row.commands)}

    def test_result(self, hook: Hook) -> dict | None:
        output = f"{hook.tool.response.get('stdout') or ''}\n{hook.tool.response.get('stderr') or ''}"
        tallies = [(int(m.group(1)), sum(int(n) for n in TALLY_FAILED.findall(m.group(0)))) for m in TALLY.finditer(output)]
        dotnet = DOTNET.findall(output)
        examples = EXAMPLES.findall(output)
        if dotnet:
            failed, passed = map(int, dotnet[-1])
        elif tallies:
            total, failed = tallies[-1]
            passed = total - failed
        elif examples:
            total, failed = map(int, examples[-1])
            passed = total - failed
        else:
            passed = sum(int(n) for n in PASSED.findall(output) + PHPUNIT_OK.findall(output))
            failed = sum(int(n) for n in FAILED.findall(output)) or sum(int(n) for n in FAILING.findall(output))
            if not (passed or failed or FAILING.search(output)):
                return None
        return {"passed": passed, "failed": failed}

    def effect(self, hook: Hook) -> str:
        if hook.tool.name in WRITES:
            return "writes" if self.in_project(hook.tool.file_path, hook.cwd) else ""
        return self.effect_of(hook.command) if hook.tool.name == "Bash" else ""

    def effect_of(self, command: str) -> str:
        return next(iter(self.effects(command)), "")

    def effects(self, command: str) -> list[str]:
        rest = self.without_journal(command)
        if not rest.strip():
            return []
        bare = QUOTED.sub("''", rest)
        return [name for name, pattern in EFFECTS if pattern.search(rest) or (name == "writes" and WRITING_COMMANDS.search(bare))]

    def without_journal(self, command: str) -> str:
        return JOURNAL_CALL.sub(r"\1", command)

    def context(self, hook: Hook) -> float | None:
        return None

    def usage(self, path: Path, now: float | None = None) -> dict | None:
        return None

    def dispatch(self, tool) -> dict:
        return {}

    def question(self, tool) -> bool:
        return tool.name in self.question_tools

    def session(self, path: Path | None) -> dict:
        return {}

    def model(self, hook: Hook) -> str:
        return hook.model

    def effort(self, project: Path, transcript: Path | None = None) -> str:
        return ""

    def entries(self, path: Path | None) -> list[tuple[int, dict]]:
        try:
            raw = Path(path).read_text().splitlines()
        except (OSError, TypeError):
            return []
        found = []
        for i, line in enumerate(raw, 1):
            try:
                row = json.loads(line)
            except ValueError:
                continue
            if isinstance(row, dict):
                found.append((i, row))
        return found

    def transcript(self, path: Path) -> list:
        turns = [Turn(i, *turn) for i, row in self.entries(path) for turn in [self.turn(row)] if turn]
        return self.refine(turns)

    def refine(self, turns: list[Turn]) -> list[Turn]:
        return turns

    def turn(self, row: dict) -> tuple[str, str] | None:
        return None

    def tools(self, path: Path) -> list[dict]:
        return [use for _, row in self.entries(path) for use in self.tool_uses(row)]

    def tool_uses(self, row: dict) -> list[dict]:
        return []

    def crew(self, path: Path) -> dict:
        return {}

    def subagent_transcript(self, path: Path, session: str) -> Path | None:
        return None

    def loaded_skills(self, path: Path) -> dict[str, float]:
        return {str((use.get("input") or {}).get("skill")): float(use.get("at") or 0) for use in self.tools(path)
                if use.get("name") == "Skill" and (use.get("input") or {}).get("skill")}

    @abstractmethod
    def present(self, project: Path) -> bool: ...

    def settings(self, project: Path) -> dict:
        try:
            return json.loads(self.config(project).read_text())
        except (OSError, ValueError):
            return {}

    def hooks(self, project: Path) -> dict:
        return self.settings(project).get("hooks", {})

    def set_hooks(self, project: Path, hooks: dict) -> dict:
        for event, blocks in hooks.items():
            if not isinstance(blocks, list) or not all(isinstance(b, dict) and isinstance(b.get("hooks"), list) and all(isinstance(h, dict) and str(h.get("command", "")).strip() for h in b["hooks"]) for b in blocks):
                raise ValueError(f"{event}: every block needs a list of hooks, each with a command")
        had = self.settings(project)
        had["hooks"] = {event: blocks for event, blocks in hooks.items() if blocks}
        self.save(project, had)
        return had["hooks"]

    def save(self, project: Path, settings: dict) -> Path:
        f = self.config(project)
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps(settings, indent=2) + "\n")
        return f

    def wire(self, project: Path, command: str) -> Path:
        had = self.settings(project)
        hooks = had.setdefault("hooks", {})
        name, root = command.split("/hook.", 1)[1].split()[1:3]
        ours = f" {name} {root}"
        for event, blocks in self.wiring(command)["hooks"].items():
            mine = [b for b in hooks.get(event, []) if command in json.dumps(b) or not ("/hook." in json.dumps(b) and ours in json.dumps(b))]
            if not any(command in json.dumps(b) for b in mine):
                mine.extend(blocks)
            hooks[event] = mine
        return self.save(project, had)
