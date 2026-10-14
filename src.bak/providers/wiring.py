from pathlib import Path

from engine.managed import remember_rewritten
from engine.package import code
from providers import PROVIDERS
from providers.base import HookCommand


def repaired(root: Path) -> list[str]:
    """The agents of the project whose hooks were missing, stale or pointed at a path that is gone, now wired again as this version writes them and recorded as the journal's own writing, so an upgrade never takes them for the user's edit; nothing when all is well."""
    project = Path(root).parent
    lines = []
    for name, cls in PROVIDERS.items():
        provider = cls()
        if not provider.present(project):
            continue
        hook = HookCommand(code(Path(root)) / "hook.sh", name, Path(root))
        why = provider.unwired(project, hook)
        if why:
            remember_rewritten(project, Path(root), provider.wire(project, hook))
            lines.append(f"{name}: {why}, so its hooks were written again")
    return lines
