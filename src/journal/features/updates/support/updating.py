import contextvars
import os
import subprocess
import threading
import time
from typing import Callable

from journal.config import Config
from journal.support.where import Where
from journal.features.updates.support.release import Release
from journal.features.updates.support.release_installer import ReleaseInstaller
from journal.features.updates.support.release_source import ReleaseSource
from journal.features.updates.support.update_mark import UpdateMark
from journal.features.updates.support.update_standing import UpdateStanding
from journal.features.updates.support.update_target import UpdateTarget
from journal.supervisor_link import SupervisorLink
from journal.support.actor import Actor
from journal.support.refused import Refused
from journal.repositories.settings import Settings
from journal.version import VERSION

PLUGIN = "code-commandments"
CHECK_EVERY = 3600
FIRST_CHECK_AFTER = 60


class Updating:
    """The newest release of the installed major version, or the head of the branch the settings name, asked of GitHub at most hourly on a thread of its own, and its install: on its own when the user has switched that on, or when they say so."""

    def __init__(self, settings: Settings, source: ReleaseSource, installer: ReleaseInstaller, mark: UpdateMark, supervisor: SupervisorLink, config: Config) -> None:
        self.settings, self.source, self.installer = settings, source, installer
        self.mark, self.supervisor, self.config = mark, supervisor, config
        self.releases: list[Release] = []
        self.head = ""
        """The commit at the head of the followed branch, as last read."""
        self.problem = ""
        self._checked_at = time.time() - CHECK_EVERY + FIRST_CHECK_AFTER
        self._working = threading.Lock()

    def running(self) -> Release:
        return Release(VERSION)

    def branch(self) -> str:
        """The branch the journal follows; empty when it follows the releases."""
        from journal.features.updates.feature import Updates
        return str(self.settings.option(Updates.BRANCH)).strip()

    def repository(self) -> str:
        from journal.features.updates.feature import Updates
        return str(self.settings.option(Updates.REPOSITORY)).strip()

    def follow(self, branch: str, by: Actor) -> None:
        """Sets the branch the journal follows; empty follows the releases again."""
        from journal.features.updates.feature import Updates
        self.settings.set(Updates.BRANCH.key, branch.strip(), by)
        self.head = ""

    def installed_commit(self) -> str:
        """The commit the installer recorded; empty for an install from before it was recorded."""
        kept = self.config.home / "src" / "commit"
        return kept.read_text().strip() if kept.is_file() else ""

    def label(self) -> str:
        """What is installed, as the chat and the update's mark name it: the version, or the followed branch at its commit."""
        return f"{self.branch()} at {self.installed_commit()[:7] or 'an unrecorded commit'}" if self.branch() else VERSION

    def newer(self) -> list[Release]:
        """The known releases newer than the installed one, of its major version, oldest first."""
        return [release for release in self.releases if release.upgrades(self.running())]

    def is_out(self) -> bool:
        """Whether there is something newer to install: a release, or a commit on the followed branch."""
        if self.branch():
            return bool(self.head) and self.head != self.installed_commit()
        return bool(self.newer())

    def target(self) -> UpdateTarget:
        """What an update now would install, refused when nothing newer is out."""
        if not self.is_out():
            raise Refused(f"there is nothing newer than {self.label()} to install")
        if self.branch():
            return UpdateTarget(self.branch(), f"{self.branch()} at {self.head[:7]}")
        newest = self.newer()[-1]
        return UpdateTarget(newest.tag, newest.version)

    def automatic(self) -> bool:
        """Whether the user has switched updating on its own on and there is something newer to install."""
        from journal.features.updates.feature import Updates
        return bool(self.settings.option(Updates.AUTO)) and self.is_out()

    def latest(self) -> str:
        """The newest thing known: the followed branch's head commit, else the newest release, else the version installed."""
        if self.branch():
            return self.head[:7]
        newer = self.newer()
        return newer[-1].version if newer else VERSION

    def standing(self) -> UpdateStanding:
        held = self.mark.held()
        return UpdateStanding(installed=VERSION, latest=self.latest(), newer=self.is_out(), branch=self.branch(), versions=[release.version for release in self.newer()],
                              updating=held.to if held else "", step=held.step if held else "", problem=self.problem)

    def tick(self, now: float) -> None:
        """On the clock: an update's mark is settled, and once an hour the releases are read and, when the user wants updates on their own, the newest is installed."""
        self.settle(now)
        if now - self._checked_at >= CHECK_EVERY:
            self._checked_at = now
            self.apart(self.checked)

    def said(self) -> str:
        """Whether something newer is out, in words, or why it could not be read."""
        if self.problem:
            return self.problem
        if self.is_out():
            return f"{self.target().label} is out; {self.label()} is installed. journal update installs it"
        return f"{self.label()} is the newest commit of the branch" if self.branch() else f"{VERSION} is the newest release of version {self.running().major}"

    def settle(self, now: float) -> None:
        """An update's mark comes off once this journal runs what it went to; one whose journal went without bringing it, or that ran past its time, comes off as an update that did not finish."""
        held = self.mark.held()
        if held is None or (held.pid == os.getpid() and not held.is_stale(now)):
            return
        self.mark.clear()
        self.problem = "" if held.to == self.label() else f"The update to {held.to} did not finish: .journal/runtime/update.log says how it went"

    def update_now(self, by: Actor) -> None:
        self.mark.claim(self.label(), self.target().label)
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
        self.install_newest(Where().actor)

    def read(self) -> None:
        """The releases of this major version, or the followed branch's head, read from the repository."""
        try:
            if self.branch():
                self.head = self.source.head_of(self.repository(), self.branch())
            else:
                self.releases = Release.named(self.source.tags(f"v{self.running().major}."))
            self.problem = ""
        except (OSError, ValueError, subprocess.TimeoutExpired) as error:
            self.problem = f"The releases could not be read from {self.repository()}: {error}"

    def install_newest(self, by: Actor) -> None:
        """Under the update's mark: the release itself, and the journal restarted on it when the install did not. A plugin is upgraded only when the user or the agent says so, never by the journal's own update."""
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
        """The journal started again on the code just installed, by the supervisor that hosts it; one no supervisor hosts is left to its next start."""
        host = self.supervisor.hosting()
        if host is not None:
            self.supervisor.restart_journal(host)
