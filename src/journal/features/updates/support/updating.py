import contextvars
import subprocess
import threading
import time
from typing import Callable

from journal.support.where import Where
from journal.support.plugin_installing import PluginInstalling
from journal.features.updates.support.release import Release
from journal.features.updates.support.release_installer import ReleaseInstaller
from journal.features.updates.support.release_source import ReleaseSource
from journal.features.updates.support.update_standing import UpdateStanding
from journal.support.actor import Actor
from journal.support.refused import Refused
from journal.repositories.environments import Environments
from journal.repositories.plugins import Plugins
from journal.support.scope import Scope
from journal.repositories.settings import Settings
from journal.version import VERSION

PLUGIN = "code-commandments"
CHECK_EVERY = 3600
FIRST_CHECK_AFTER = 60


class Updating:
    """The newest release of the installed major version, asked of GitHub at most hourly on a thread of its own, and its install: on its own when the user has switched that on, or when they say so."""

    def __init__(self, settings: Settings, source: ReleaseSource, installer: ReleaseInstaller, installing: PluginInstalling, plugins: Plugins, environments: Environments, scope: Scope) -> None:
        self.settings, self.source, self.installer, self.installing, self.plugins, self.environments, self.scope = settings, source, installer, installing, plugins, environments, scope
        self.releases: list[Release] = []
        self.problem = ""
        self.under_way = ""
        self._checked_at = time.time() - CHECK_EVERY + FIRST_CHECK_AFTER
        self._working = threading.Lock()

    def running(self) -> Release:
        return Release(VERSION)

    def newer(self) -> list[Release]:
        """The known releases newer than the installed one, of its major version, oldest first."""
        return [release for release in self.releases if release.upgrades(self.running())]

    def automatic(self) -> bool:
        """Whether the user has switched updating on its own on and there is a newer release to install."""
        from journal.features.updates.feature import Updates
        return bool(self.settings.option(Updates.AUTO)) and bool(self.newer())

    def standing(self) -> UpdateStanding:
        newer = self.newer()
        return UpdateStanding(installed=VERSION, latest=newer[-1].version if newer else VERSION, newer=bool(newer), versions=[release.version for release in newer], updating=self.under_way, problem=self.problem)

    def tick(self, now: float) -> None:
        """On the clock: once an hour, the releases are read and, when the user wants updates on their own, the newest is installed."""
        if now - self._checked_at >= CHECK_EVERY:
            self._checked_at = now
            self.apart(self.checked)

    def newest(self) -> Release:
        newer = self.newer()
        if not newer:
            raise Refused(f"there is no release newer than {VERSION} to install")
        return newer[-1]

    def said(self) -> str:
        """Whether a newer release is out, in words, or why the releases could not be read."""
        if self.problem:
            return self.problem
        newer = self.newer()
        return f"{newer[-1].version} is out; {VERSION} is installed. journal update installs it" if newer else f"{VERSION} is the newest release of version {self.running().major}"

    def update_now(self, by: Actor) -> None:
        self.newest()
        if not self.apart(lambda: self.install_newest(by)):
            raise Refused("an update is under way already")

    def apart(self, work: Callable[[], None]) -> bool:
        """The work on a thread of its own in the caller's scope, unless other work of this kind is running."""
        if not self._working.acquire(blocking=False):
            return False
        threading.Thread(target=contextvars.copy_context().run, args=(self.released, work), name="updates", daemon=True).start()
        return True

    def released(self, work: Callable[[], None]) -> None:
        try:
            work()
        finally:
            self._working.release()

    def checked(self) -> None:
        self.read()
        if self.automatic():
            self.install_newest(Where().actor)

    def read(self) -> None:
        try:
            self.releases = Release.named(self.source.tags(f"v{self.running().major}."))
            self.problem = ""
        except (OSError, ValueError) as error:
            self.problem = f"The releases could not be read from GitHub: {error}"

    def install_newest(self, by: Actor) -> None:
        """The code-commandments plugin, when installed, pulled first, since the install restarts the journal; then the release itself."""
        release = self.newest()
        self.under_way, problems = release.version, []
        with self.scope.of(self.environments.existing(Where().environment).id):
            try:
                self.pull_plugin(by)
            except Refused as refused:
                problems.append(f"The {PLUGIN} plugin was not upgraded: {refused}")
        try:
            self.installer.run(release)
        except Refused as refused:
            problems.append(str(refused))
        self.problem, self.under_way = " ".join(problems), ""

    def pull_plugin(self, by: Actor) -> None:
        """A fetched plugin is only ever moved to a release: its newest tag, when newer than the release tag recorded on its row, or when none is recorded yet."""
        found = [plugin for plugin in self.plugins.where(name=PLUGIN) if not plugin.linked]
        if not found:
            return
        try:
            released = Release.named(self.source.tags_of(found[0].source))
        except (OSError, subprocess.TimeoutExpired) as error:
            raise Refused(str(error)) from error
        if released and (not found[0].release or released[-1].is_newer_than(Release(found[0].release))):
            self.installing.upgrade(PLUGIN, released[-1].tag, Where().environment, by)
