import re
from pathlib import Path

import features

SESSION = r"(?P<session>.+)"
MOVED = [
    (re.compile(rf"seat-{SESSION}\.json"), "seat.json"),
    (re.compile(rf"session-{SESSION}\.json"), "session.json"),
    (re.compile(rf"screen-{SESSION}\.json"), "screen.json"),
    (re.compile(rf"screen-{SESSION}"), "screen"),
    (re.compile(rf"printed-{SESSION}"), "printed"),
    (re.compile(rf"typed-{SESSION}"), "typed"),
    (re.compile(rf"announced-{SESSION}\.json"), "announced.json"),
    (re.compile(rf"relaunch-{SESSION}\.json"), "relaunch.json"),
    (re.compile(rf"displayed-{SESSION}\.json"), "displayed.json"),
    (re.compile(rf"trigger-{SESSION}-(?P<name>(?:{'|'.join(features.names())})(?:\.[a-z_]+)?)\.json"), "trigger-{name}.json"),
]
LEFT_OVER = [re.compile(p) for p in (
    r"(needed|planned|skills-required)-.+\.json", r"[0-9a-f]{8}-[0-9a-f-]{27}\.json", r".+\.(context|lines)\.cache", r"bar-.+\.json",
    r".+\.index\.json", r"engines(-.+)?\.lock", r"engine-.+\.log", r"(shown|statusbar|displayed-debug)\.log", r"bindings\.map", r"session-\.json", r"trigger-.+\.json")]


def target(runtime: Path, name: str, envs: list[str]) -> Path | None:
    for env in envs:
        found = re.fullmatch(rf"gate-{re.escape(env)}-{SESSION}\.json", name)
        if found:
            return runtime / "sessions" / found["session"] / f"gate-{env}.json"
    for pattern, named in MOVED:
        found = pattern.fullmatch(name)
        if found:
            return runtime / "sessions" / found["session"] / named.format(**found.groupdict())
    return None


def run(root: Path) -> str:
    runtime = Path(root) / "runtime"
    if not runtime.is_dir():
        return "no runtime folder"
    envs = sorted((p.name for p in (Path(root) / "environments").glob("*") if p.is_dir()), key=len, reverse=True)
    moved = removed = 0
    for f in sorted(p for p in runtime.iterdir() if p.is_file()):
        to = target(runtime, f.name, envs)
        if to is not None:
            to.parent.mkdir(parents=True, exist_ok=True)
            f.replace(to)
            moved += 1
        elif any(pattern.fullmatch(f.name) for pattern in LEFT_OVER):
            f.unlink()
            removed += 1
    return f"runtime: {moved} per-session files moved into sessions/<session>/, {removed} left-over files removed"
