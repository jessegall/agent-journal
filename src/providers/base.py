import json
import shlex
import time
from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import ClassVar

from engine.fields import Loaded
from engine.transcript import Turn
from providers.jsonl import WholeRead, parsed_row, tail_lines, whole_lines
from providers.payload import AgentCall, AskCall, AskedQuestion, Asking, BashCall, Chunk, Dispatch, Failure, FetchCall, Hook, HookEvent, HookFacts, PERMISSION, ReadCall, STATUS, SearchCall, SkillCall, UsageWindow, WriteCall
from providers.transcript_cache import CACHE, RECENT_BYTES
from resources.base import Refused
from resources.types import IDLE
from engine.stored import read_json, write_text

LEGACY = ".journal/hook.py"
LIBRARY = ".agents/skills"
MARK = "[journal]"
JOURNAL, PERSON = "journal", "person"
KEPT_ENDED = 20


def journal_hook(text: str) -> bool:
    return LEGACY in text or ("/hook.sh" in text and "/.journal" in text)


def running_and_latest(rows: list[dict]) -> list[dict]:
    late = {id(row) for row in [row for row in rows if not row.get("running")][-KEPT_ENDED:]}
    return [row for row in rows if row.get("running") or id(row) in late]


@dataclass(frozen=True)
class HookCommand:
    script: Path
    provider: str
    root: Path

    @property
    def text(self) -> str:
        return shlex.join(["sh", str(self.script), self.provider, str(self.root)])

    def wired_in(self, block: dict) -> bool:
        return self.text in json.dumps(block)

    def replaces(self, block: dict) -> bool:
        found = json.dumps(block)
        endings = (f" {self.provider} {self.root}", " " + shlex.join([self.provider, str(self.root)]))
        return self.text not in found and (LEGACY in found or ("/hook." in found and any(ending in found for ending in endings)))


REFUSED = "refused"


@dataclass(frozen=True)
class SubagentRow:
    id: str
    task: str
    type: str
    model: str
    running: bool
    at: float
    ended: float
    status: str
    session: str

    def to_json(self) -> dict:
        return asdict(self)


@dataclass
class SkillWindows:
    used: int = 0
    loads: dict[str, int] = field(default_factory=dict)
    prior_used: int = 0
    prior_loads: dict[str, int] = field(default_factory=dict)

    def begin(self) -> None:
        self.prior_used, self.prior_loads = self.used, self.loads
        self.used, self.loads = 0, {}

    def loaded(self, skill: str) -> None:
        self.loads[skill] = self.used


@dataclass(frozen=True)
class Decision(Loaded):
    decision: str = ""


@dataclass
class TypedRun:
    at: float
    command: str
    output: str | None = None


@dataclass
class TypedRuns:
    runs: list[TypedRun] = field(default_factory=list)


def asking_row(asked: Asking | None) -> dict:
    return asdict(asked) if asked is not None else {}


@dataclass
class WorkLinks:
    links: list[str] = field(default_factory=list)


@dataclass
class BackgroundTasks:
    started: dict[str, float] = field(default_factory=dict)
    ended: dict[str, float] = field(default_factory=dict)
    failed: set[str] = field(default_factory=set)
    commands: dict[str, str] = field(default_factory=dict)
    detached: dict[str, int] = field(default_factory=dict)
    printed: dict[str, float] = field(default_factory=dict)


class Provider(ABC):
    tool_kinds: ClassVar[dict] = {"Bash": BashCall, "Read": ReadCall, "NotebookRead": ReadCall, "Edit": WriteCall, "MultiEdit": WriteCall, "Write": WriteCall,
                                  "NotebookEdit": WriteCall, "Grep": SearchCall, "Glob": SearchCall, "WebSearch": SearchCall, "WebFetch": FetchCall,
                                  "Skill": SkillCall, "Agent": AgentCall, "Task": AgentCall}
    session_variable: ClassVar[str] = ""
    follow_up: ClassVar[str] = ""
    session_markers: ClassVar[tuple[str, ...]] = ()
    name = ""
    home = ""
    question_tools = frozenset()
    briefing_file = ""
    skill_home = ""
    shared_files: tuple = ()
    shared_if_ignored: tuple = ()
    worktrees: tuple = ()
    link_skills = False
    retired_skill_homes = ()
    sleeping_tools = ()
    echoes_typed = False
    background_wakes = False
    applies_at_once = ()
    controls = {"groups": [], "note": "This CLI does not expose model controls."}
    dispatch_default = ""

    @classmethod
    def briefing_limit(cls) -> int:
        return 0

    @classmethod
    def control_options(cls, current_model: str) -> dict:
        return cls.controls

    @classmethod
    def control_choice(cls, action: str, value: str, current_model: str) -> dict:
        configured = cls.control_options(current_model)
        group = next((group for group in configured.get("groups", []) if group["key"] == action), None)
        selected = next((item for item in (group or {}).get("choices", []) if item["value"] == value), None)
        if not selected:
            raise Refused(f"{cls.name or 'this agent'} does not support {action} {value!r}")
        chosen = {"action": action, **selected}
        commands = cls.commands_for(action, value, current_model)
        return {**chosen, "commands": commands, "command": commands[0]} if commands else chosen

    @classmethod
    def commands_for(cls, action: str, value: str, current_model: str) -> list[str]:
        return []

    @abstractmethod
    def config(self, project: Path) -> Path: ...

    @abstractmethod
    def wiring(self, command: str) -> dict: ...

    def compacted(self, hook: Hook) -> bool:
        return False

    @classmethod
    def display_chunk(cls, raw: dict) -> Chunk | None:
        return None

    def response(self, event: str, text: str) -> dict:
        return {"hookSpecificOutput": {"hookEventName": event, "additionalContext": text}} if text else {}

    def blocking(self, reason: str) -> dict:
        return {"decision": "block", "reason": reason,
                "hookSpecificOutput": {"hookEventName": HookEvent.PRE_TOOL_USE, "permissionDecision": "deny", "permissionDecisionReason": reason}}

    def refused(self, response: dict) -> bool:
        return Decision.from_json(response).decision == "block"

    def context(self, hook: Hook) -> float | None:
        return None

    def usage(self, path: Path, now: float | None = None) -> list[UsageWindow] | None:
        return None

    def dispatch(self, tool, project: Path) -> Dispatch | None:
        return None

    def shell_wrapper(self, script: Path) -> dict:
        return {}

    def unwrapped_command(self, command: str) -> str:
        return command

    def shell_runs(self, path: Path) -> list[tuple[float, str]]:
        return []

    def typed_runs(self, path: Path) -> list[TypedRun]:
        return []

    def failure(self, path: Path) -> Failure | None:
        return None

    def work_links(self, path: Path) -> list[str]:
        return []

    def background_tasks(self, path: Path) -> BackgroundTasks:
        return BackgroundTasks()

    def skill_load(self, name: str) -> str:
        return f"Skill: {name}"

    def question(self, tool) -> bool:
        return tool.name in self.question_tools

    def asked_questions(self, tool) -> list[AskedQuestion]:
        return [question for question in tool.questions if question.text] if isinstance(tool, AskCall) else []

    def session(self, path: Path | None) -> dict:
        return {}

    def inbox(self, hook: Hook) -> str:
        return ""

    def model(self, hook: Hook) -> str:
        return hook.model

    def effort(self, project: Path, transcript: Path | None = None) -> str:
        return ""

    def recent_rows(self, path: Path | None) -> list[dict]:
        return CACHE.recent(path, self.row_of)

    def settling(self, path: Path) -> bool:
        return False

    def turns(self, path: Path) -> list:
        return CACHE.transcript(path, self.extended)

    def extended(self, turns: list[Turn], lines: list[bytes], count: int) -> list[Turn]:
        return self.refine(turns + self.read_turns(lines, count))

    def every_turn(self, path: Path, why: WholeRead) -> list:
        return self.refine(self.read_turns(whole_lines(path, why).lines, 0))

    def last_turns(self, path: Path, span: int = RECENT_BYTES) -> list:
        lines = tail_lines(path, span).lines
        return self.refine(self.read_turns(lines, 0))

    def read_turns(self, lines: list[bytes], count: int) -> list:
        turns = []
        for i, found in enumerate((parsed_row(line, self.row_of) for line in lines), count + 1):
            turn = self.turn(found, i) if found is not None else None
            if turn:
                turns.append(turn)
        return turns

    def refine(self, turns: list[Turn]) -> list[Turn]:
        return turns

    def row_of(self, raw: dict):
        return raw

    def turn(self, row, line: int) -> Turn | None:
        return None

    def tool_uses(self, row: dict) -> list[dict]:
        return []

    def crew(self, path: Path) -> dict:
        return {}

    def stop_instruction(self, task: str) -> str:
        return f"stop task {task} now"

    def conversation_file(self, conversation: str) -> Path | None:
        return None

    def subagent_transcript(self, path: Path, session: str) -> Path | None:
        return None

    def is_subagent(self, hook) -> bool:
        return False

    def thoughts(self, transcript: Path, offset: int) -> tuple[list[tuple[str, str]], int]:
        return [], offset

    def status(self, hook) -> str:
        return IDLE if hook.tool.name in self.sleeping_tools else STATUS[hook.event]

    def facts(self, hook, root: Path) -> HookFacts:
        return HookFacts(event=hook.event, tool=hook.tool.name, file=hook.tool.path, cwd=hook.cwd, transcript=str(hook.transcript) if hook.transcript else "",
                         inbox=self.inbox(hook), model=self.model(hook), effort=self.effort(Path(hook.cwd or root.parent), hook.transcript),
                         context=self.context(hook), asking=asking_row(self.asking(hook)), last_message=hook.last_message, prompted=self.prompted(hook),
                         transcript_facts=self.session(hook.transcript))

    def prompted(self, hook) -> str | None:
        if hook.event != HookEvent.USER_PROMPT_SUBMIT:
            return None
        return JOURNAL if self.journal_typed(hook.prompt) else PERSON

    def journal_typed(self, prompt: str) -> bool:
        return prompt.lstrip().startswith(MARK)

    def dispatch_model(self, chosen: str) -> str:
        return chosen

    def models(self) -> tuple[str, ...]:
        """The models a dispatch may name; empty when the provider cannot tell."""
        return tuple(self.model_labels())

    def model_labels(self) -> dict[str, str]:
        return {}

    def offers(self, model: str) -> bool:
        return not self.models() or model in self.models()

    def asking(self, hook) -> Asking | None:
        return Asking(hook.tool.name, hook.tool.text[:300], time.time()) if hook.event == PERMISSION else None

    def read_ahead(self, path: Path) -> None:
        self.turns(path)
        self.loaded_skills(path)
        self.prior_window(path)
        self.recent_rows(path)

    def loaded_skills(self, path: Path) -> dict[str, float]:
        return dict(self.folded(path, self.skill_loads, dict))

    def has_read_every_load(self, path: Path) -> bool:
        return CACHE.caught_up(path, self.skill_loads, dict)

    def starts_window(self, row: dict) -> bool:
        return False

    def tokens_of(self, row: dict) -> int | None:
        return None

    def prior_window(self, path: Path) -> SkillWindows:
        return self.folded(path, self.skill_windows, SkillWindows)

    def skill_windows(self, windows: SkillWindows, row: dict) -> SkillWindows:
        if self.starts_window(row):
            windows.begin()
        used = self.tokens_of(row)
        if used is not None:
            windows.used = used
        for skill in self.skills_in(self.tool_uses(row)):
            windows.loaded(skill)
        return windows

    def skill_loads(self, loads: dict, row: dict) -> dict:
        if self.starts_window(row):
            loads.clear()
        for use in self.tool_uses(row):
            if use.loaded_skill:
                loads[use.loaded_skill] = use.at
        return loads

    def skills_in(self, uses: list) -> list[str]:
        return sorted({use.loaded_skill for use in uses} - {""})

    def skills(self, session: Path | None) -> list[str]:
        if session is None or not session.is_file():
            return []
        return sorted(self.folded(session, self.skill_names, set))

    def skill_names(self, names: set, row) -> set:
        names.update(self.skills_in(self.tool_uses(row)))
        return names

    def folded(self, path: Path, fold, start):
        return CACHE.folded(path, fold, start, self.row_of)

    @abstractmethod
    def present(self, project: Path) -> bool: ...

    @abstractmethod
    def agent_file(self, project: Path, name: str) -> Path: ...

    @abstractmethod
    def agent_text(self, kind, model: str) -> str: ...

    def agent_types(self, project: Path, chosen: list) -> list[Path]:
        written = []
        for kind, model in chosen:
            text = self.agent_text(kind, model)
            target = self.agent_file(project, kind.name)
            if not target.is_file() or target.read_text() != text:
                target.parent.mkdir(parents=True, exist_ok=True)
                write_text(target, text)
                written.append(target)
        return written

    def settings(self, project: Path) -> dict:
        return read_json(self.config(project), dict, {})

    def wired(self, project: Path) -> str:
        blocks = [block for listed in (self.settings(project).get("hooks") or {}).values() for block in listed]
        return next((hook["command"] for block in blocks for hook in block.get("hooks", []) if journal_hook(hook.get("command", ""))), "")

    def browser_logins(self, project: Path, storage: Path) -> bool:
        return False

    def wiring_trouble(self, project: Path) -> str:
        command = self.wired(project)
        if not command:
            return "no journal hook is wired"
        words = shlex.split(command)
        if len(words) != 4 or words[0] != "sh":
            return f"its hook command does not split into sh, script, agent and journal: {command}"
        if not Path(words[1]).is_file():
            return f"its hook runs {words[1]}, which does not exist"
        if not Path(words[3]).is_dir():
            return f"its hook names the journal {words[3]}, which does not exist"
        return ""

    def hook_files(self, project: Path) -> list[Path]:
        return [self.config(project)]

    def hooks(self, project: Path) -> dict:
        return self.settings(project).get("hooks", {})

    def hooks_elsewhere(self, project: Path) -> list[dict]:
        found = []
        for f in self.hook_files(project):
            if f == self.config(project):
                continue
            hooks = read_json(f, dict, {}).get("hooks") or {}
            if hooks:
                shown = f"~/{f.relative_to(Path.home())}" if f.is_relative_to(Path.home()) and not f.is_relative_to(project) else str(f.relative_to(project))
                found.append({"path": shown, "hooks": hooks})
        return found

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
        write_text(f, json.dumps(settings, indent=2) + "\n")
        return f

    def wire(self, project: Path, hook: HookCommand) -> Path:
        had = self.settings(project)
        hooks = had.setdefault("hooks", {})
        for event, blocks in self.wiring(hook.text)["hooks"].items():
            kept = [b for b in hooks.get(event, []) if not hook.replaces(b)]
            if not any(hook.wired_in(b) for b in kept):
                kept.extend(blocks)
            hooks[event] = kept
        saved = self.save(project, had)
        self.finish_wiring(project, hook)
        return saved

    def finish_wiring(self, project: Path, hook: HookCommand) -> None:
        return None
