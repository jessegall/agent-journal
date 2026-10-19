from dataclasses import dataclass

from journal.features.plugins.support.preview_row import PreviewRow


@dataclass(frozen=True)
class PluginPreview:
    """What a plugin is and everything it would run, hear and hold, before it is installed or upgraded; an upgrade's also says what changes."""

    name: str
    title: str
    version: str
    description: str
    source: str
    commit: str
    rows: tuple[PreviewRow, ...]
    linked: bool = False
    was: str = ""
    """The commit an upgrade starts from."""
    changes: tuple[str, ...] = ()
    code: tuple[str, ...] = ()
    current: bool = False
    """True for an upgrade that changes nothing."""

    def files_changed(self) -> list[str]:
        """Each file the code changes, with its lines added and taken out, read from the diff."""
        counts: dict[str, list[int]] = {}
        name = ""
        for line in self.code:
            if line.startswith("+++ "):
                name = line[4:].removeprefix("b/")
                counts.setdefault(name, [0, 0])
            elif name and line.startswith("+") and not line.startswith("+++"):
                counts[name][0] += 1
            elif name and line.startswith("-") and not line.startswith("---"):
                counts[name][1] += 1
        return [f"{name} +{added} -{taken}" for name, (added, taken) in counts.items()]
