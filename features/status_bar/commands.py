import re
import time
from pathlib import Path

from engine.shell import without_scripts
from providers.payload import Hook
from resources.types import AgentRow, COMMAND, RUNNING

WRITES = ("Edit", "Write", "MultiEdit", "NotebookEdit")
READS = ("Read", "NotebookRead")
TOOLS = {"Grep": "searches", "Glob": "searches", "WebSearch": "searches", "WebFetch": "fetches",
         "Agent": "dispatches", "Task": "dispatches", "Skill": "loads"}
WRITING_COMMANDS = re.compile(r"(^|[;&|]\s*)(rm|mv|cp|git (commit|push|rm|mv)|sed -i|tee|touch|mkdir|npm install|pip install)\b|(?<![\d&])>>?\s*(?!/dev/null|&)\S")
RING = 12
JOURNAL_DIR = ".journal"
CHANGING = ("writes", "deletes")
START = r"(?:^|[;&|(]\s*|\b(?:do|then)\s+)"
READING = r"(?:^|[;&]\s*|\b(?:do|then)\s+)"
EFFECTS = (
    ("tests", re.compile(START + r"(?:\S*[Pp]ython[\d.]*\s+(?:-m\s+)?\S*tests?/\S*|pytest|npm (?:run )?test|npx (?:vitest|jest)|vitest|jest|go test|cargo test|phpunit|php artisan test|dotnet test|mvn\b[^;&|]*\btest|\S*gradlew?\b[^;&|]*\btest|(?:bundle exec )?rspec|mix test)\b")),
    ("tests", re.compile(r"(?=.*\b(?:test_|tests?\b))(?=.*\b(?:[Pp]ython[\d.]*|node|npx|perl)\s+[\"']?\$\w)", re.S)),
    ("installs", re.compile(START + r"(?:npm (?:ci|install|i)|yarn(?: (?:install|add))?|pnpm (?:install|add)|bun (?:install|add)|(?:\S*[Pp]ython[\d.]*\s+-m\s+)?pip[\d.]*\s+install|uv (?:pip )?(?:install|sync|add)|poetry (?:install|add)|composer (?:install|update|require)|bundle install|go mod (?:download|tidy)|cargo (?:fetch|install)|gem install|brew (?:install|bundle))\b")),
    ("builds", re.compile(START + r"(?:npm run build|yarn build|pnpm (?:run )?build|npx (?:vite|tsc|webpack|esbuild|rollup)|vite build|tsc|webpack|make|cargo build|go build|dotnet build|docker build|mvn\b[^;&|]*\b(?:package|compile)|\S*gradlew?\b[^;&|]*\bbuild)\b")),
    ("deletes", re.compile(START + r"(?:rm|rmdir|unlink|git rm)\s")),
    ("writes", re.compile(START + r"(?:perl\s+-\w*i|sed\s+-i)|\.write_text\(|\.write\(|open\([^)]*,\s*(?:mode=)?['\"][wa]b?\+?['\"]")),
    ("searches", re.compile(READING + r"(?:grep|rg|ag|find|fd)\b")),
    ("searches", re.compile(READING + r"(?:cat|head|tail|less|sed -n|wc|ls|stat)\b[^;&|]*\*")),
    ("reads", re.compile(READING + r"(?:cat|head|tail|less|grep|rg|sed -n|wc|ls|find|tree|stat|file|diff|git (?:log|show|diff|status))\b")),
)
PASSED = re.compile(r"\b(\d+) passed\b")
FAILED = re.compile(r"\b(\d+) failed\b")
FAILING = re.compile(r"\bfiles failing: (\d+)")
PHPUNIT_OK = re.compile(r"^OK \((\d+) tests?", re.M)
DOTNET = re.compile(r"\bFailed:\s*(\d+),\s*Passed:\s*(\d+)")
EXAMPLES = re.compile(r"\b(\d+) (?:examples?|tests?), (\d+) failures?")
TALLY = re.compile(r"\bTests(?: run)?: (\d+),.*$", re.M)
TALLY_FAILED = re.compile(r"\b(?:Failures|Errors): (\d+)")
BROKE = re.compile(r"^(?:npm ERR!|ERROR in |error TS\d+|Build failed|Compilation failed|.*failed to compile)", re.M | re.I)
QUOTED = re.compile(r'"(?:[^"\\]|\\.)*"' + r"|'[^']*'")
JOURNAL_CALL = re.compile(r"(^|[;&|(]\s*|\$\()\S*journal(?:\.py)?\s(?:\"(?:[^\"\\]|\\.)*\"|'[^']*'|\d*>&\d|[^;&|)\n])*")


def stamped(commands: list, running: dict, doing: str = "", at: float = 0.0) -> list:
    rows = list(commands)
    ended = {COMMAND.done: running.get(RUNNING.done) or at, COMMAND.result: running.get(RUNNING.result)}
    ended = {k: v for k, v in ended.items() if v}
    when = running.get(RUNNING.at)
    which = next((i for i in reversed(range(len(rows))) if when and rows[i].get(COMMAND.at) == when), None)
    if which is None:
        which = next((i for i in reversed(range(len(rows)))
                      if doing and rows[i].get(COMMAND.what) == doing and not rows[i].get(COMMAND.done)), None)
    return [{**one, **ended} if i == which else one for i, one in enumerate(rows)]


def writes(hook: Hook) -> bool:
    if hook.tool.name in WRITES:
        return in_project(hook.tool.file_path, hook.cwd)
    return hook.tool.name == "Bash" and any(name in CHANGING for name in effects(hook.command))


def in_project(path: str, cwd: str) -> bool:
    if not path or not cwd:
        return True
    project = Path(cwd).resolve()
    target = (project / path).resolve()
    return project in target.parents and JOURNAL_DIR not in target.relative_to(project).parts[:1]


def shell(row, hook: Hook) -> dict:
    doing = hook.tool.doing.strip()[:400]
    running = dict(row.running)
    before = {k: v for k, v in running.items() if k in (RUNNING.what, RUNNING.tool, RUNNING.at, RUNNING.done, RUNNING.effect, RUNNING.changed, RUNNING.result)}
    if hook.event == "UserPromptSubmit":
        return {AgentRow.running: {RUNNING.before: before} if before.get(RUNNING.done) else {}, AgentRow.commands: list(row.commands)}
    if hook.event == "PreToolUse" and doing:
        now = time.time()
        kind = effect(hook)
        running = {RUNNING.what: doing, RUNNING.tool: hook.tool.name, RUNNING.at: now, **({RUNNING.effect: kind} if kind else {}),
                   **({RUNNING.before: before} if before.get(RUNNING.done) else {})}
        ran = {COMMAND.what: doing, COMMAND.tool: hook.tool.name, COMMAND.at: now,
               **({COMMAND.effect: kind} if kind else {}),
               **({COMMAND.files: [hook.tool.file_path]} if hook.tool.file_path else {}),
               **({COMMAND.subject: hook.tool.subject} if hook.tool.subject and not hook.tool.file_path else {})}
        return {AgentRow.running: running, AgentRow.commands: (list(row.commands) + [ran])[-RING:]}
    if running and not running.get(RUNNING.done):
        running[RUNNING.done] = time.time()
        result = outcome_of(hook, running.get(RUNNING.effect) or "")
        if result:
            running[RUNNING.result] = result
    return {AgentRow.running: running, AgentRow.commands: stamped(row.commands, running, doing, time.time())}


def outcome_of(hook: Hook, effect: str) -> dict | None:
    if effect == "tests":
        return test_result(hook)
    if effect != "builds":
        return None
    output = f"{hook.tool.response.get('stdout') or ''}\n{hook.tool.response.get('stderr') or ''}"
    return {"ok": not BROKE.search(output)} if output.strip() else None


def test_result(hook: Hook) -> dict | None:
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


def effect(hook: Hook) -> str:
    if hook.tool.name in READS:
        return "reads"
    if hook.tool.name in WRITES:
        return "writes" if in_project(hook.tool.file_path, hook.cwd) else ""
    if hook.tool.name in TOOLS:
        return TOOLS[hook.tool.name]
    return effect_of(hook.command) if hook.tool.name == "Bash" else ""


def effect_of(command: str) -> str:
    return next(iter(effects(command)), "")


def effects(command: str) -> list[str]:
    whole = without_journal(command)
    if not whole.strip():
        return []
    bare = QUOTED.sub("''", whole)
    bare_words = without_scripts(bare)
    return [name for name, pattern in EFFECTS
            if pattern.search(whole if name == "writes" else bare_words) or (name == "writes" and WRITING_COMMANDS.search(bare))]


def without_journal(command: str) -> str:
    return JOURNAL_CALL.sub(r"\1", command)
