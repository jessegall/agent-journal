import contextvars
import os
import subprocess
import threading
import time as timing
from typing import Callable

from journal.config import Config
from journal.support.caller import Caller
from journal.features.updates.support.release import Release
from journal.features.updates.support.release_installer import ReleaseInstaller
from journal.features.updates.support.release_source import ReleaseSource
from journal.features.updates.support.update_mark import UpdateMark
from journal.features.updates.support.update_data import UpdateData
from journal.features.updates.support.update_target import UpdateTarget
from journal.supervisor_link import SupervisorLink
from journal.support.actor import Actor
from journal.support.refused import Refused
from journal.repositories.setting_rows import SettingRows
from journal.version import VERSION

PLUGIN = "code-commandments"
CHECK_INTERVAL_SECONDS = 3600
FIRST_CHECK_DELAY_SECONDS = 60


class Updating:
    """The newest release of the installed major version, or the head of the branch the settings name, asked of GitHub at most hourly on a thread of its own, and its install: on its own when the user has switched that on, or when they say so."""

    def __init__(self, settings: SettingRows, source: ReleaseSource, installer: ReleaseInstaller, mark: UpdateMark, supervisor: SupervisorLink, config: Config) -> None:
        self.settings, self.source, self.installer = settings, source, installer
        self.mark, self.supervisor, self.config = mark, supervisor, config
        self.releases: list[Release] = []
        self.head = ""
        self.problem = ""
        self._checked_at = timing.time() - CHECK_INTERVAL_SECONDS + FIRST_CHECK_DELAY_SECONDS
        self._working = threading.Lock()

    def running(self) -> Release:
        return Release(VERSION)

    def branch(self) -> str:
        from journal.features.updates.feature import Updates
        return str(self.settings.option(Updates.BRANCH)).strip()

    def repository(self) -> str:
        from journal.features.updates.feature import Updates
        return str(self.settings.option(Updates.REPOSITORY)).strip()

    def follow(self, branch: str, actor: Actor) -> None:
        from journal.features.updates.feature import Updates
        self.settings.set(Updates.BRANCH.key, branch.strip(), actor)
        self.head = ""

    def installed_commit(self) -> str:
        kept = self.config.home / "src" / "commit"
        return kept.read_text().strip() if kept.is_file() else ""

    def label(self) -> str:
        return f"{self.branch()} at {self.installed_commit()[:7] or 'an unrecorded commit'}" if self.branch() else VERSION

    def newer(self) -> list[Release]:
        return [release for release in self.releases if release.upgrades(self.running())]

    def is_out(self) -> bool:
        if self.branch():
            return bool(self.head) and self.head != self.installed_commit()
        return bool(self.newer())

    def target(self) -> UpdateTarget:
        if not self.is_out():
            raise Refused(f"there is nothing newer than {self.label()} to install")
        if self.branch():
            return UpdateTarget(self.branch(), f"{self.branch()} at {self.head[:7]}")
        newest = self.newer()[-1]
        return UpdateTarget(newest.tag, newest.version)

    def automatic(self) -> bool:
        from journal.features.updates.feature import Updates
        return bool(self.settings.option(Updates.AUTO)) and self.is_out()

    def latest(self) -> str:
        if self.branch():
            return self.head[:7]
        newer = self.newer()
        return newer[-1].version if newer else VERSION

    def data(self) -> UpdateData:
        held = self.mark.held()
        return UpdateData(installed=self.label(), latest=self.latest(), newer=self.is_out(), branch=self.branch(), versions=[release.version for release in self.newer()],
                              updating=held.to if held else "", step=held.step if held else "", problem=self.problem)

    def tick(self, time: float) -> None:
        self.settle(time)
        if time - self._checked_at >= CHECK_INTERVAL_SECONDS:
            self._checked_at = time
            self.apart(self.checked)

    def said(self) -> str:
        if self.problem:
            return self.problem
        if self.is_out():
            return f"{self.target().label} is out; {self.label()} is installed. journal update installs it"
        return f"{self.label()} is the newest commit of the branch" if self.branch() else f"{VERSION} is the newest release of version {self.running().major}"

    def settle(self, time: float) -> None:
        held = self.mark.held()
        if held is None or (held.pid == os.getpid() and not held.is_stale(time)):
            return
        self.mark.clear()
        self.problem = "" if held.to == self.label() else f"The update to {held.to} did not finish: .journal/runtime/update.log says how it went"

    def update_now(self, actor: Actor) -> None:
        self.mark.claim(self.label(), self.target().label)
        if not self.apart(lambda: self.install_newest(actor)):
            raise Refused("an update is under way already")

    def apart(self, work: Callable[[], None]) -> bool:
        if not self._working.acquire(blocking=False):
            return False
        threading.Thread(target=contextvars.copy_context().run, args=(self.released, work), name="updates", daemon=True).start()
        return True

    def released(self, work: Callable[[], None]) -> None:
        try:
            work()
        except Exception as fault:
            self.problem = f"The update failed: {fault}"
            self.mark.clear()
            raise
        finally:
            self._working.release()

    def checked(self) -> None:
        self.read()
        if not self.automatic():
            return
        try:
            self.mark.claim(self.label(), self.target().label)
        except Refused as refused:
            self.problem = str(refused)
            return
        self.install_newest(Caller().actor)

    def read(self) -> None:
        try:
            if self.branch():
                self.head = self.source.head_of(self.repository(), self.branch())
            else:
                self.releases = Release.named(self.source.tags(f"v{self.running().major}."))
            self.problem = ""
        except (OSError, ValueError, subprocess.TimeoutExpired) as error:
            self.problem = f"The releases could not be read from {self.repository()}: {error}"

    def install_newest(self, actor: Actor) -> None:
        target = self.target()
        self.mark.step("Installing the new version")
        try:
            self.installer.run(target.ref, self.repository())
        except Refused as refused:
            self.problem = str(refused)
            self.mark.clear()
            return
        self.problem = ""
        self.mark.step("Restarting the journal")
        self.restart()

    def restart(self) -> None:
        host = self.supervisor.hosting()
        if host is not None:
            self.supervisor.restart_journal(host)
