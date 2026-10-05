from features.base import FeatureDetails
from features.hosting.files import HOSTING
from engine.organization import FOLDER
from features.trigger import MINUTES, Trigger
from features.groups import Group


class HostingDetails(FeatureDetails):
    name = "hosting"
    group = Group.TICKETS
    label = "Run a copy of the app for each ticket"
    hint = "From its worktree, while it is worked on"
    skill_of = "organization"
    when = "a ticket's app is started, opened or stopped"

    title = "A copy of the app for each ticket"

    abstract = "While a ticket is worked on, a copy of the project's app runs from the ticket's worktree."

    help = f"""
        {FOLDER}/{HOSTING} names the app: run is the command, with {{port}} and {{worktree}} filled in; ready is the path that
        answers once it is up; idle_minutes is how long it keeps running after the ticket's agent stops. journal ticket host
        <n> starts the ticket's app as a service in its worktree on a port of its own, journal ticket app <n> gives its
        address and state, and journal ticket unhost <n> stops it. An app whose ticket's agent has been gone idle_minutes is
        stopped by itself.
    """

    trigger = Trigger(every=1, unit=MINUTES)
