import hashlib
from pathlib import Path

from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginDigest:
    """The digest of the files a plugin runs, its manifest, program and settings file, by their sizes and change
    times, so a check on every hook costs a few file reads of their metadata."""

    @staticmethod
    def digest(folder: Path) -> str:
        manifest = PluginManifest.read(folder)
        parts: list[str] = []
        for name in manifest.files:
            path = folder / name
            stat = path.stat() if path.exists() else None
            parts.append(f"{name}:{stat.st_size}:{stat.st_mtime_ns}" if stat else f"{name}:missing")
        return hashlib.sha256("\n".join(parts).encode()).hexdigest()
