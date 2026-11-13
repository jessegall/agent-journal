from engine.file.file_access import FileAccess
import re
from dataclasses import dataclass
from pathlib import Path

from engine.version.version_numbers import VersionNumbers
from engine.errors.refusal import Refusal

MANIFEST_FILE = "journal-plugin.json"
VERSIONED_MANIFEST = re.compile(r"journal-plugin\.(\d+(?:\.\d+)*)\.json")


@dataclass(frozen=True)
class PluginManifestFiles:
    """The manifests in a plugin folder: journal-plugin.json, the floor with no journal version, and any
    journal-plugin.<version>.json, each for the journal version in its name. A journal reads the one for the
    highest version at or below its own, and journal-plugin.json when there is none."""

    folder: Path
    plain: bool
    versions: tuple[str, ...]

    @classmethod
    def listed(cls, folder: Path) -> "PluginManifestFiles":
        versions = tuple(match.group(1) for match in (VERSIONED_MANIFEST.fullmatch(path.name) for path in FileAccess.glob(folder, "journal-plugin.*.json")) if match)
        return cls(folder, FileAccess.is_file(folder / MANIFEST_FILE), tuple(sorted(versions, key=VersionNumbers.parsed)))

    @property
    def names(self) -> tuple[str, ...]:
        plain = tuple([MANIFEST_FILE]) if self.plain else ()
        return (*plain, *(f"journal-plugin.{version}.json" for version in self.versions))

    def chosen(self, journal_version: str) -> Path:
        running = VersionNumbers.parsed(journal_version)
        fitting = [version for version in self.versions if VersionNumbers.parsed(version) <= running]
        if fitting:
            return self.folder / f"journal-plugin.{fitting[-1]}.json"
        if self.plain:
            return self.folder / MANIFEST_FILE
        if self.versions:
            raise Refusal(f"every manifest in {self.folder} is for a newer journal: the lowest is for {self.versions[0]}, this journal is {journal_version}",
                          "update the journal, or ask the plugin for a manifest of this version")
        raise Refusal(f"{self.folder} contains no plugin: {MANIFEST_FILE} is missing", "name the folder of a plugin")
