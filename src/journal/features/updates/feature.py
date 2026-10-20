from journal.features.feature import Feature
from journal.features.updates.commands.update_command import UpdateCommand
from journal.features.updates.listeners.check_for_releases import CheckForReleases
from journal.support.option import Option


class Updates(Feature):
    AUTO = Option("updates.auto", "Install new releases on its own", "When a newer release of this major version is out, install it, upgrade the code-commandments plugin if it is installed, and restart the journal; a new major version is never installed on its own", False, kind="switch")
    name = "updates"
    title = "Updates"
    help = "Finds the newest release of this version of the journal on GitHub, hourly, and installs it when you say so or, if you switch that on, by itself."
    options = (AUTO,)
    listeners = (CheckForReleases,)
    commands = (UpdateCommand,)
