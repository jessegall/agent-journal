import sys
from pathlib import Path

from core.base.refusal import Refusal
from install.built_bundle import BuiltBundle, SKIPPED_FOLDERS

MODULE_ROOTS = ("core", "suites", "tunnels")
WINDOW_BUILD_SCRIPT = Path("viewer") / "kit" / "build.js"
SHELL_DIST = Path("core") / "modules" / "viewer" / "web" / "dist"
SHELL_SOURCES = (Path("viewer") / "src", Path("viewer") / "kit", Path("viewer") / "index.html", Path("viewer") / "vite.config.js")
BUILD_COMMAND = "npm --prefix src/viewer run build"


class BuiltBundles:
    """The built viewer folders of a source tree, the shell's and each module's window build, against the sources
    each was built from: an install of a tree whose bundles are behind their sources is refused, since the
    viewer would read what the server no longer sends."""

    def __init__(self, source: Path) -> None:
        self.source = source

    def all(self) -> list[BuiltBundle]:
        shell = BuiltBundle(self.source / SHELL_DIST, tuple(self.source / path for path in SHELL_SOURCES))
        return [shell, *(self.module_bundle(config) for config in self.window_configs())]

    def module_bundle(self, config: Path) -> BuiltBundle:
        web = config.parent
        return BuiltBundle(web / "dist", (web / "src", config, self.source / WINDOW_BUILD_SCRIPT))

    def window_configs(self) -> list[Path]:
        return sorted(config for root in MODULE_ROOTS for config in (self.source / root).rglob("web/vite.config.js")
                      if not SKIPPED_FOLDERS.intersection(config.relative_to(self.source / root).parts))

    def stale(self) -> list[BuiltBundle]:
        return [bundle for bundle in self.all() if not bundle.is_current()]

    def require_current(self) -> None:
        stale = self.stale()
        if stale:
            names = ", ".join(str(bundle.dist.relative_to(self.source)) for bundle in stale)
            raise Refusal(f"the built viewer is behind its sources in {names}", f"run {BUILD_COMMAND}, then install again")

    def stamp_all(self) -> None:
        for bundle in self.all():
            bundle.write_stamp()


if __name__ == "__main__":
    BuiltBundles(Path(sys.argv[1]).resolve()).stamp_all()
