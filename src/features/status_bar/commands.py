import re
import time
from pathlib import Path

from engine.shell import without_scripts
from providers.payload import AgentCall, BashCall, FetchCall, Hook, ReadCall, SearchCall, SkillCall, WriteCall
from dataclasses import replace

from features.status_bar.runs import CommandRun, Outcome, command_runs, current_run
from resources.types import AgentRow

KINDS = ((ReadCall, "reads"), (SearchCall, "searches"), (FetchCall, "fetches"), (AgentCall, "dispatches"), (SkillCall, "loads"))
WRITING_COMMANDS = re.compile(r"(^|[;&|]\s*)(rm|mv|cp|git (commit|push|rm|mv)|sed -i|tee|touch|mkdir|npm install|pip install)\b|(?<![\d&])>>?\s*(?!/dev/null|&)\S")
RING = 30
JOURNAL_DIR = ".journal"
CHANGING = ("writes", "deletes")
START = r"(?:^|[;&|(\n]\s*|\b(?:do|then)\s+)"
READING = r"(?:^|[;&\n]\s*|\b(?:do|then)\s+)"
EFFECTS = (
    ("pulls", re.compile(START + r"gh pr (?:create|merge|close)\b")),
    ("tests", re.compile(START + r"(?:\S*[Pp]ython[\d.]*\s+(?:-m\s+)?\S*tests?/\S*|pytest|npm (?:run )?test|npx (?:vitest|jest)|vitest|jest|go test|cargo test|phpunit|php artisan test|dotnet test|mvn\b[^;&|]*\btest|\S*gradlew?\b[^;&|]*\btest|(?:bundle exec )?rspec|mix test)\b")),
    ("tests", re.compile(r"\A(?=.*\b(?:test_|tests?\b))(?=.*\b(?:[Pp]ython[\d.]*|node|npx|perl)\s+[\"']?\$\w)", re.S)),
    ("installs", re.compile(START + r"(?:npm (?:ci|install|i)|yarn(?: (?:install|add))?|pnpm (?:install|add)|bun (?:install|add)|(?:\S*[Pp]ython[\d.]*\s+-m\s+)?pip[\d.]*\s+install|uv (?:pip )?(?:install|sync|add)|poetry (?:install|add)|composer (?:install|update|require)|bundle install|go mod (?:download|tidy)|cargo (?:fetch|install)|gem install|brew (?:install|bundle))\b")),
    ("builds", re.compile(START + r"(?:npm run build|yarn build|pnpm (?:run )?build|npx (?:vite|tsc|webpack|esbuild|rollup)|vite build|tsc|webpack|make|cargo build|go build|dotnet build|docker build|mvn\b[^;&|]*\b(?:package|compile)|\S*gradlew?\b[^;&|]*\bbuild)\b")),
    ("deletes", re.compile(START + r"(?:rm|rmdir|unlink|git rm)\s")),
    ("writes", re.compile(START + r"(?:perl\s+-\w*i|sed\s+-i)|\.write_text\(|\.write\(|open\([^)]*,\s*(?:mode=)?['\"][wa]b?\+?['\"]")),
    ("searches", re.compile(READING + r"(?:grep|rg|ag|find|fd)\b")),
    ("searches", re.compile(READING + r"(?:cat|head|tail|less|sed -n|wc|ls|stat)\b[^;&|]*\*")),
    ("reads", re.compile(READING + r"(?:cat|head|tail|less|grep|rg|sed -n|wc|ls|find|tree|stat|file|diff|git (?:log|show|diff|status))\b")),
)
PASSED = re.compile(r"\b(\d+) passed\b")
PULL = re.compile(r"gh pr (create|merge|close)\b(?:\s+(?!-)(\S+))?")
PULL_URL = re.compile(r"https://github\.com/[^/\s]+/[^/\s]+/pull/(\d+)")
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


def stamped(runs: list[CommandRun], running: CommandRun, doing: str = "", at: float = 0.0) -> list[dict]:
    done = running.done if running.done else at
    which = next((i for i in reversed(range(len(runs))) if running.at and runs[i].at == running.at), None)
    if which is None:
        which = next((i for i in reversed(range(len(runs))) if doing and runs[i].command == doing and not runs[i].done), None)
    finished = lambda one: replace(one, done=done, result=running.result if running.result else one.result)
    ended = [finished(one) if i == which else one for i, one in enumerate(runs)]
    return [one.to_json() for one in ended]


def writes(hook: Hook) -> bool:
    if isinstance(hook.tool, WriteCall):
        return in_project(hook.tool.file_path, hook.cwd)
    return any(name in CHANGING for shell in hook.tool.commands for name in effects(shell))


def in_project(path: str, cwd: str) -> bool:
    if not path or not cwd:
        return True
    project = Path(cwd).resolve()
    target = (project / path).resolve()
    return project in target.parents and JOURNAL_DIR not in target.relative_to(project).parts[:1]


def shell(row, hook: Hook) -> dict:
    doing = hook.tool.doing.strip()[:400]
    running = current_run(row)
    before = CommandRun(command=running.command, tool=running.tool, at=running.at, done=running.done, effect=running.effect,
                        changed=running.changed, result=running.result)
    if hook.event == "UserPromptSubmit":
        return {AgentRow.running: CommandRun(before=before).to_json() if before.done else {}, AgentRow.commands: list(row.commands)}
    if hook.event == "PreToolUse" and doing:
        now = time.time()
        kind = effect(hook)
        started = CommandRun(command=doing, tool=hook.tool.name, at=now, effect=kind, before=before if before.done else None)
        paths = hook.tool.paths
        ran = CommandRun(command=doing, tool=hook.tool.name, at=now, effect=kind, files=paths, subject="" if paths else hook.tool.subject)
        return {AgentRow.running: started.to_json(), AgentRow.commands: (list(row.commands) + [ran.to_json()])[-RING:]}
    if row.running and not running.done:
        result = outcome_of(hook, running.effect)
        running = replace(running, done=time.time(), result=result if result else running.result)
    return {AgentRow.running: running.to_json(), AgentRow.commands: stamped(command_runs(row), running, doing, time.time())}


def outcome_of(hook: Hook, effect: str) -> Outcome | None:
    if effect == "tests":
        return test_result(hook)
    if effect == "pulls":
        return pull_result(hook)
    if effect != "builds":
        return None
    output = printed(hook)
    return Outcome(ok=not BROKE.search(output)) if output.strip() else None


def printed(hook: Hook) -> str:
    return hook.tool.printed if isinstance(hook.tool, BashCall) else ""


def pull_result(hook: Hook) -> Outcome | None:
    asked = next((found for found in map(PULL.search, hook.tool.commands) if found), None)
    if not asked:
        return None
    output = printed(hook)
    given = asked.expand(r"\2")
    found = PULL_URL.search(output) or PULL_URL.search(given)
    number = found.group(1) if found else given.lstrip("#")
    return Outcome(pull=asked.group(1), url=found.group(0) if found else "", number=number if number.isdigit() else "")


def test_result(hook: Hook) -> Outcome | None:
    output = printed(hook)
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
    return Outcome(passed=passed, failed=failed)


def effect(hook: Hook) -> str:
    call = hook.tool
    if isinstance(call, WriteCall):
        return "writes" if in_project(call.file_path, hook.cwd) else ""
    if isinstance(call, BashCall):
        return effect_of(call.command)
    return next((name for kind, name in KINDS if isinstance(call, kind)), "")


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
