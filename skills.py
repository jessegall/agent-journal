import inspect
import os
import shutil
from pathlib import Path

import features
from commands.parser import actions
from controllers.base import COMMANDS
from controllers.types import CONTROLLERS
from providers import PROVIDERS

HERE = Path(__file__).resolve().parent
LIBRARY = ".agents/skills"
LINKED = {name: cls.skill_home for name, cls in PROVIDERS.items() if cls.link_skills}
RETIRED = tuple(dict.fromkeys(home for cls in PROVIDERS.values() for home in cls.retired_skill_homes))


def signature(controller: type, name: str) -> str:
    fn = COMMANDS.get(controller.resource.type, {}).get(name) or getattr(controller, name)
    params = list(inspect.signature(fn).parameters.values())[1:]
    words = []
    for p in params:
        if p.kind is inspect.Parameter.VAR_KEYWORD:
            words.append("[--set key=value…]")
        elif p.default is inspect.Parameter.empty:
            words.append(f"<{p.name}>")
        else:
            words.append(f"[--{p.name} …]" if not isinstance(p.default, bool) else f"[--{p.name}]")
    return " ".join(words)


def reference() -> str:
    out = ["## Reference: every noun and its words", ""]
    for type_, controller in CONTROLLERS.items():
        r = controller.resource
        out.append(f"### {type_} — {r.details.abstract}")
        out.append(f"{r.details.help}  Scope: {r.scope}. Seen by: {', '.join(r.notified) or 'nobody'}.")
        for name in sorted({*actions(controller), *COMMANDS.get(type_, {})}):
            word = r.command_names.get(name, name)
            out.append(f"    journal {type_} {word} {signature(controller, name)}".rstrip())
        out.append("")
    return "\n".join(out)


def core() -> str:
    text = (HERE / "skills" / "journal.md").read_text()
    return f"---\nname: journal\ndescription: The journal, its commands and when each applies; load it before the first write\n---\n\n{text}\n{reference()}"


def subject(name: str) -> str:
    source = HERE / "skills" / f"{name}.md"
    if not source.is_file():
        return ""
    body = source.read_text().split("---", 2)[-1].strip()
    return "\n".join(line for line in body.splitlines() if not line.startswith("# ")).strip()


def feature_skill(f) -> str:
    d = f.describe()
    trigger = d["trigger"]
    when = (f"on {trigger['on']}" if trigger.get("on") else f"at {', '.join(map(str, trigger['at']))} percent of the context" if trigger.get("at")
            else f"every {trigger['every']} {trigger['unit']}" if trigger else "on the events it listens to")
    said = subject(d["name"])
    return (f"---\nname: journal-{d['name']}\ndescription: {d['abstract']}\n---\n\n# {d['title']}\n\n{d['abstract']}.\n\n{d['help']}\n\n{said + chr(10) + chr(10) if said else ''}"
            f"{f'It listens to: ' + ', '.join(d['listens']) + f'. It speaks {when}. ' if d['listens'] else ''}"
            f"{'On' if d['default'] else 'Off'} by default. Settings switches it per environment and sets how often it speaks; "
            f"{'each of its behaviours — ' + ', '.join(d['behaviours']) + ' — carries its own switch and cadence beside it' if d['behaviours'] else 'it has one switch'}.\n")


def render() -> dict[str, str]:
    features.load()
    out = {"journal/SKILL.md": core()}
    for source in sorted((HERE / "skills").glob("*.md")):
        if source.name != "journal.md" and source.stem not in features.FEATURES:
            out[f"journal-{source.stem}/SKILL.md"] = source.read_text()
    for name, f in features.FEATURES.items():
        out[f"journal-{name}/SKILL.md"] = feature_skill(f)
    return out


def write(folder: Path) -> list[Path]:
    written = []
    for path, text in render().items():
        f = folder / path
        if f.parent.is_symlink():
            f.parent.unlink()
        f.parent.mkdir(parents=True, exist_ok=True)
        if not f.is_file() or f.read_text() != text:
            f.write_text(text)
        written.append(f)
    return written


def library(project: Path, folder: Path) -> bool:
    return folder.resolve() == (project / LIBRARY).resolve()


def link(project: Path, name: str, agents: tuple[str, ...] = tuple(LINKED)) -> list[Path]:
    source = project / LIBRARY / name
    links = []
    for agent in agents:
        target = project / LINKED[agent] / name
        target.parent.mkdir(parents=True, exist_ok=True)
        if library(project, target.parent):
            continue
        if target.is_symlink() or target.is_file():
            target.unlink()
        elif target.is_dir():
            shutil.rmtree(target)
        target.symlink_to(os.path.relpath(source, target.parent))
        links.append(target)
    return links


def unlink(project: Path, name: str) -> None:
    for home in (LIBRARY, *LINKED.values()):
        target = project / home / name
        if target.is_symlink():
            target.unlink()
        elif target.is_dir():
            shutil.rmtree(target)


def pruned(project: Path, names: list[str]) -> list[Path]:
    gone = []
    for home in (LIBRARY, *LINKED.values()):
        for stale in sorted((project / home).glob("journal*")):
            if stale.name not in names and (stale.is_symlink() or stale.is_dir()):
                unlink(project, stale.name)
                gone.append(stale)
    return gone


def publish(project: Path, agents: tuple[str, ...]) -> tuple[list[Path], list[Path]]:
    written = write(project / LIBRARY)
    names = sorted({f.parent.name for f in written})
    pruned(project, names)
    for home in RETIRED:
        if library(project, project / home):
            continue
        for stale in (project / home).glob("journal*"):
            if stale.is_dir() and not stale.is_symlink():
                shutil.rmtree(stale)
    linked = [t for name in names for t in link(project, name, tuple(a for a in agents if a in LINKED))]
    return written, linked
