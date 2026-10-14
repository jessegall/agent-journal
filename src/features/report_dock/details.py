from declaring.details import FeatureDetails
from declaring.groups import Group


class ReportDockDetails(FeatureDetails):
    explains = "A report the agent writes sits above the chat box until you open it, press one of its buttons or put it away."
    name = "report_dock"
    group = Group.CHAT
    label = "Keep a new report above the chat until you open or put it away"
    has_skill = False

    title = "Report above the chat"

    abstract = "The newest report the agent wrote stays above the chat box until you deal with it"

    help = """
        When the agent writes or finishes a report, it sits above the chat box as a bar. It stays there until you open
        it, press one of its buttons or put it away with its close button, whatever else happens in the chat. An update
        stays until you press a button or put it away, even after you have read it. A newer report takes its place.
    """
