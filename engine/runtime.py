from pathlib import Path

from engine.stored import write_text

DEFAULT_ENV = "main"


def folder(root: Path) -> Path:
    return Path(root) / "runtime"


def env_file(root: Path) -> Path:
    return folder(root) / "env"


def off_file(root: Path) -> Path:
    return folder(root) / "off"


def channel_queue(root: Path) -> Path:
    return folder(root) / "channel.jsonl"


def channel_alive(root: Path) -> Path:
    return folder(root) / "channel.on"


def relaunch_file(root: Path, session: str) -> Path:
    return folder(root) / f"relaunch-{session}.json"


def env(root: Path) -> str:
    try:
        return env_file(root).read_text().strip() or DEFAULT_ENV
    except OSError:
        return DEFAULT_ENV


def set_env(root: Path, name: str) -> None:
    write_text(env_file(root), name)


def off(root: Path) -> bool:
    return off_file(root).is_file()
