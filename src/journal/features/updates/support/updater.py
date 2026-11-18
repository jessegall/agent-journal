import contextvars
import os
import subprocess
import threading
from typing import Callable

from journal.config import Config
from journal.support.release import Release
from journal.features.updates.support.commit_ancestry import CommitAncestry
from journal.features.updates.support.release_installer import ReleaseInstaller
from journal.features.updates.support.official_install import OfficialInstall
from journal.features.updates.support.release_refusal import ReleaseRefusal
from journal.features.updates.support.release_source import ReleaseSource
from journal.features.updates.support.update_card import UpdateCard
from journal.features.updates.support.update_path_file import UpdatePathFile
from journal.features.updates.support.update_path_record import UpdatePathRecord
from journal.features.updates.support.update_pause import UpdatePause
from journal.features.updates.support.update_data import UpdateData
from journal.features.updates.support.update_target import UpdateTarget
from journal.features.shell.support.restart_queue import RestartQueue
from journal.features.shell.support.unsupervised_journal import UnsupervisedJournal
from journal.supervisor_link import SupervisorLink
from journal.support.actor import Actor
from journal.support.caller import LOCAL_USER
from journal.support.rejection import Rejection
from journal.repositories.setting_rows import SettingRows
from journal.version import VERSION
from journal.features.updates.updates_options import UpdatesOptions
from journal.support.time_source import TimeSource

PLUGIN = "code-commandments"
# what the install command from the README installs when it is asked for no release of its own, and how the card names it
README_REF = "main"
README_TARGET = "the latest release"

# how much of each command a waiting restart names on the update cover
WAITING_COMMAND_CHARACTERS = 60

class Updater:
    """The newest release of the installed major version, or the head of the branch the settings name, asked of GitHub as often as the settings say on a thread of its own, and its install: on its own when the user has switched that on, or when they say so."""

    def __init__(self, settings: SettingRows, source: ReleaseSource, installer: ReleaseInstaller, card: UpdateCard, supervisor: SupervisorLink, config: Config, queue: RestartQueue, ancestry: CommitAncestry, official: OfficialInstall, time_source: TimeSource, paths: UpdatePathFile) -> None:
        self.time_source, self.paths = time_source, paths
        self.official = official
        self.ancestry = ancestry
        self.settings, self.source, self.installer = settings, source, installer
        self.card, self.supervisor, self.config, self.queue = card, supervisor, config, queue
        self.releases: list[Release] = []
        self.head = ""
        self.is_head_ahead = False
        self.problem = ""
        self._next_check_at = self.source.next_check_time(self.check_interval_seconds())
        self.releases = Release.lookup(self.source.stored_tags(Release.major_prefix(self.running().major)))
        self._working = threading.Lock()
        self.started_at = self.time_source.seconds()

    def running(self) -> Release:
        return Release(VERSION)

    def branch(self) -> str:
        return str(self.settings.option(UpdatesOptions.BRANCH)).strip()

    def repository(self) -> str:
        return str(self.settings.option(UpdatesOptions.REPOSITORY)).strip()

    def follow(self, branch: str, actor: Actor) -> None:
        self.settings.set(UpdatesOptions.BRANCH.key, branch.strip(), actor)
        self.head = ""
        self.is_head_ahead = False

    def installed_commit(self) -> str:
        stored = self.config.home / "src" / "commit"
        return stored.read_text().strip() if stored.is_file() else ""

    def label(self) -> str:
        return f"{self.branch()} at {self.installed_commit()[:7] or 'an unrecorded commit'}" if self.branch() else VERSION

    def newer(self) -> list[Release]:
        return [release for release in self.releases if release.upgrades(self.running())]

    def is_published(self) -> bool:
        if self.branch():
            return bool(self.head) and self.is_head_ahead
        return bool(self.newer())

    def target(self) -> UpdateTarget:
        if not self.is_published():
            raise Rejection(f"there is nothing newer than {self.label()} to install")
        if self.branch():
            return UpdateTarget(self.branch(), f"{self.branch()} at {self.head[:7]}", f"{self.head[:12]} is ahead of the installed {self.installed_commit()[:12] or 'unrecorded commit'}")
        newest = self.newer()[-1]
        return UpdateTarget(newest.tag, newest.version)

    def automatic(self) -> bool:
        return bool(self.settings.option(UpdatesOptions.AUTO)) and self.is_published() and not self.paths.record().has_failed(VERSION)

    def check_interval_seconds(self) -> int:
        return self.settings.integer(UpdatesOptions.CHECK_INTERVAL) * 60

    def latest(self) -> str:
        if self.branch():
            return self.head[:7]
        newer = self.newer()
        return newer[-1].version if newer else VERSION

    def data(self) -> UpdateData:
        blocked = self.card.running()
        record = self.paths.record() if self.paths.is_unfinished(VERSION, self.time_source.seconds()) else UpdatePathRecord.empty()
        return UpdateData(installed=self.label(), latest=self.latest(), newer=self.is_published(), branch=self.branch(), versions=[release.version for release in self.newer()],
                              updating=blocked.target if blocked else "", step=blocked.step if blocked else "", problem=self.shown_problem(), started_at=self.started_at,
                              step_count=len(record.steps) + 1 if record.target else 0, step_version=record.next_version(VERSION) if record.target else "", final_version=record.target)

    def tick(self, time: float) -> None:
        self.reconcile(time)
        if time >= self._next_check_at:
            self._next_check_at = time + self.check_interval_seconds()
            self.separate(self.checked)

    def shown_problem(self) -> str:
        return self.problem or self.paths.record().problem(VERSION)

    def line(self) -> str:
        if self.shown_problem():
            return self.shown_problem()
        if self.is_published():
            return f"{self.target().label} is out; {self.label()} is installed. journal update installs it"
        return f"{self.label()} is the newest commit of the branch" if self.branch() else f"{VERSION} is the newest release of version {self.running().major}"

    def reconcile(self, time: float) -> None:
        blocked = self.card.paused()
        if blocked is None:
            return
        if self.paths.record().has_failed(VERSION):
            self.card.clear()
            return
        if self.paths.is_unfinished(VERSION, time):
            self.walked(blocked, time)
            return
        if blocked.is_pending(VERSION, os.getpid(), time):
            return
        self.card.clear()
        if blocked.target != self.label():
            self.problem = f"The update to {blocked.target} did not finish: .journal/runtime/update.log says how it went"
            return
        self.problem = ""

    def walked(self, blocked: UpdatePause, time: float) -> None:
        line = self.paths.record().step_line(VERSION)
        if (blocked.pid, blocked.step) != (os.getpid(), line):
            self.card.write(blocked.with_process(os.getpid(), time, line))

    def update_immediately(self, actor: Actor) -> None:
        self.read()
        self.card.begin(self.label(), self.target().label)
        self.paths.cleared()
        if not self.separate(lambda: self.install_newest(actor)):
            raise Rejection("an update is under way already")

    def force_update(self) -> None:
        self.card.begin(self.label(), README_TARGET)
        if not self.separate(self.readme_install):
            raise Rejection("an update is under way already")

    def readme_install(self) -> None:
        self.card.step("Updating the journal to the latest version")
        installed = self.official.installation(README_REF)
        if installed.returncode != 0:
            self.problem = f"The install command from the README failed: {(installed.stderr or installed.stdout).strip()[-300:]}"
            self.card.clear()

    def retry(self, actor: Actor) -> None:
        if not self.paths.record().has_failed(VERSION):
            raise Rejection(f"no step of an update failed on {VERSION}: there is nothing to retry")
        self.update_immediately(actor)

    def close_path(self) -> None:
        if not self.paths.record().has_failed(VERSION):
            raise Rejection(f"no step of an update failed on {VERSION}: there is no path to close")
        self.paths.closed()

    def install(self, actor: Actor) -> None:
        self.read()
        self.card.begin(self.label(), self.target().label)
        self.paths.cleared()
        self.install_newest(actor)
        if self.problem:
            raise Rejection(self.problem)

    def separate(self, work: Callable[[], None]) -> bool:
        if not self._working.acquire(blocking=False):
            return False
        threading.Thread(target=contextvars.copy_context().run, args=(self.released, work), name="updates", daemon=True).start()
        return True

    def released(self, work: Callable[[], None]) -> None:
        try:
            work()
        except Exception as fault:
            self.problem = f"The update failed: {fault}"
            self.card.clear()
            raise
        finally:
            self._working.release()

    def checked(self) -> None:
        if self.paths.is_unfinished(VERSION, self.time_source.seconds()):
            return
        self.read()
        if not self.automatic():
            return
        try:
            self.card.claim(self.label(), self.target().label)
        except Rejection as refused:
            self.problem = str(refused)
            return
        self.install_newest(Actor.user(LOCAL_USER))

    def read(self) -> None:
        try:
            if self.branch():
                self.head = self.source.head_commit(self.repository(), self.branch())
                self.is_head_ahead = self.head != self.installed_commit() and self.ancestry.is_newer(self.head, self.installed_commit(), self.repository(), self.branch())
            else:
                self.releases = Release.lookup(self.source.tags(Release.major_prefix(self.running().major)))
            self.problem = ""
        except ReleaseRefusal as refused:
            self._next_check_at = refused.reset_at
        except (OSError, ValueError, subprocess.TimeoutExpired) as error:
            self.problem = f"The releases could not be read from {self.repository()}: {error}"

    def install_newest(self, actor: Actor) -> None:
        target = self.target()
        self.card.step("Installing the new version")
        try:
            self.installer.run(target.ref, self.repository(), target.reason or f"updating to {target.label}")
        except Exception as broken:
            self.installed_officially(target, broken)
            return
        self.recorded(target)
        self.card.step("Updating the journal to the latest version")

    def installed_officially(self, target: UpdateTarget, broken: Exception) -> None:
        fallback = self.official.installation(target.ref)
        if fallback.returncode != 0:
            self.refused_install(target, f"the update could not install ({broken}), nor could the official install command: {(fallback.stderr or fallback.stdout).strip()[-300:]}")
            return
        self.recorded(target)
        self.card.step("Restarting the journal")
        self.restart()

    def recorded(self, target: UpdateTarget) -> None:
        self.log_reason(target)
        self.problem = ""

    def refused_install(self, target: UpdateTarget, reason: str) -> None:
        self.log_reason(target)
        self.problem = reason
        self.card.clear()

    def log_reason(self, target: UpdateTarget) -> None:
        if target.reason:
            log = self.config.home / "runtime" / "update.log"
            log.parent.mkdir(parents=True, exist_ok=True)
            with log.open("a") as log_file:
                log_file.write(f"installing {target.label}: {target.reason}\n")

    def restart(self) -> None:
        host = self.supervisor.hosting()
        try:
            outputs = self.queue.restart(host, "") if host is not None else []
        except UnsupervisedJournal as refused:
            self.problem = f"The update installed, but {refused}"
            self.card.clear()
            return
        if outputs:
            self.card.step(f"Restarting once these commands end: {', '.join(output.headline()[:WAITING_COMMAND_CHARACTERS] for output in outputs)}")
        elif host is not None and self.queue.is_waiting(host):
            self.card.step("Restarting once the running workers end")
