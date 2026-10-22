from journal.features.feature import Feature
from journal.features.updates.commands.update_command import UpdateCommand
from journal.features.updates.listeners.release_check import ReleaseCheck
from journal.features.updates.listeners.supervisor_upgrade import SupervisorUpgrade
from journal.features.updates.listeners.session_restart_close import SessionRestartClose
from journal.features.updates.support.release_source import REPOSITORY
from journal.support.option import Option
from journal.features.updates.seeds.version_change import VersionChange
from journal.features.updates.seeds.supervisor_check import SupervisorCheck


class Updates(Feature):
    REPOSITORY = Option("updates.repository", "Install from this repository", "The git address the journal installs itself from", REPOSITORY, kind="text")
    BRANCH = Option("updates.branch", "Follow this branch", "Empty follows the releases of this major version; a branch name installs that branch's newest commit instead, with Install update, journal update and the hourly check", "", kind="text")
    AUTO = Option("updates.auto", "Install new releases on its own", "When a newer release of this major version is out, or a newer commit of the followed branch, install it and restart the journal; a new major version is never installed on its own; once a new version runs, every plugin installed from a release moves to its newest release that runs on it", False, kind="switch")
    name = "updates"
    title = "Updates"
    help = "Finds the newest release of this version of the journal on GitHub, hourly, and installs it when you say so or, if you switch that on, by itself."
    options = (REPOSITORY, BRANCH, AUTO)
    listeners = (ReleaseCheck, SupervisorUpgrade, SessionRestartClose)
    seeds = (VersionChange, SupervisorCheck)
    commands = (UpdateCommand,)
