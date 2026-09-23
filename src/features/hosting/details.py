from features.base import FeatureDetails
from features.hosting.files import HOSTING
from features.organization.files import FOLDER
from features.trigger import MINUTES, Trigger


class HostingDetails(FeatureDetails):
    name = "hosting"
    when = "a ticket's app is started, opened or stopped"

    title = "Ticket apps"

    abstract = "A ticket runs its own copy of the project's app, from its worktree, while it is worked on"

    help = f"""
        {FOLDER}/{HOSTING} names the app: run is the command, with {{port}} and {{worktree}} filled in; ready is the path that
        answers once it is up; idle_minutes is how long it keeps running after the ticket's agent stops. journal ticket host
        <n> starts the ticket's app as a service in its worktree on a port of its own, journal ticket app <n> gives its
        address and state, and journal ticket unhost <n> stops it. An app whose ticket's agent has been gone idle_minutes is
        stopped by itself.
    """

    trigger = Trigger(every=1, unit=MINUTES)
