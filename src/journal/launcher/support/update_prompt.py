from journal.config import Config
from journal.features.updates.support.release import Release
from journal.features.updates.support.release_installer import ReleaseInstaller
from journal.features.updates.support.release_source import ReleaseSource
from journal.launcher.screen import Screen
from journal.launcher.support.option import Option
from journal.support.rejection import Rejection
from journal.version import VERSION


class UpdatePrompt:
    """At a launch from a terminal, a release newer than the installed one, of the same major version, is offered before the journal starts: yes installs it, no starts as it is."""

    def __init__(self, config: Config, screen: Screen, source: ReleaseSource) -> None:
        self.config, self.screen, self.source = config, screen, source

    def newest(self) -> Release | None:
        installed = Release.named([VERSION])[0]
        try:
            newer = [r for r in Release.named(self.source.tags(f"v{installed.major}.")) if r.upgrades(installed)]
        except (OSError, ValueError):
            return None
        return newer[-1] if newer else None

    def installed_newer(self) -> bool:
        newest = self.newest()
        if newest is None:
            return False
        options = [Option(f"Update to {newest.version}, then start"), Option(f"Start with {VERSION} as it is")]
        if self.screen.pick(f"Version {newest.version} is out", [f"This journal runs {VERSION}."], options, 0) != 0:
            return False
        try:
            ReleaseInstaller(self.config).run(newest)
        except Rejection as failed:
            self.screen.pick("The update did not finish", [str(failed), f"The journal starts with {VERSION}."], [Option("Start")], 0)
            return False
        return True
