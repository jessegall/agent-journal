from dataclasses import asdict, dataclass
from typing import TypedDict

from features.plugins.declared import GUARDED, Manifest, command_text

WAITS = "The agent waits for it"
BESIDE = "Runs beside the agent"
RUNS_AS = "It runs as you, with your files and your network. These are its commands:"


@dataclass(frozen=True)
class PreviewRow:
    kind: str
    label: str
    command: str

    def line(self) -> str:
        return f"{self.kind} {self.label}: {self.command}"


def preview_rows(manifest: Manifest) -> list[PreviewRow]:
    rows = [PreviewRow("needs", wanted.tool, command_text(wanted.check)) for wanted in manifest.requires]
    rows += [PreviewRow("setup", step.name, command_text(step.run)) for step in manifest.setup]
    rows += [PreviewRow("service", service.name, command_text(service.run)) for service in manifest.services]
    rows += [PreviewRow("on", handler.pattern, handler.command) for handler in manifest.handlers]
    rows += [PreviewRow("refuse", "may refuse a write", command_text(manifest.refuse))] if manifest.refuse else []
    rows += [PreviewRow("hook", event, WAITS if manifest.waits(event) else BESIDE) for event in hooked(manifest)]
    rows += [PreviewRow("page", page.title, f"{page.service}{page.path}") for page in manifest.pages]
    rows += [PreviewRow("setting", setting.key, setting.summary) for setting in manifest.settings]
    return rows


def hooked(manifest: Manifest) -> list[str]:
    """The hook events the plugin listens to, each once: those it declares, its handlers of a hook event, and the one it may refuse."""
    named = [pattern.removeprefix("hook.") for pattern in (handler.pattern for handler in manifest.handlers) if pattern.startswith("hook.") and pattern != "hook.*"]
    guarded = [GUARDED] if manifest.refuse else []
    return list(dict.fromkeys([*manifest.hooks, *guarded, *named]))


class Previewed(TypedDict):
    name: str
    title: str
    source: str
    commit: str
    description: str
    rows: list[dict]


def previewed(manifest: Manifest, source: str, commit: str) -> Previewed:
    return {"name": manifest.name, "title": f"{manifest.heading} {manifest.version}".strip(),
            "source": source, "commit": commit, "description": manifest.description, "rows": [asdict(row) for row in preview_rows(manifest)]}


def preview(manifest: Manifest, source: str, commit: str) -> str:
    lines = [f"{manifest.heading} {manifest.version}".strip(), f"from {source}" + (f" at {commit[:12]}" if commit else ""), manifest.description, "",
             RUNS_AS]
    lines += [f"  {row.line()}" for row in preview_rows(manifest)]
    return "\n".join(lines)
