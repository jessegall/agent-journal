from features.base import FeatureDetails
from features.groups import Group


class PhoneDetails(FeatureDetails):
    name = "phone"
    group = Group.VIEWER
    label = "Connect a phone"
    hint = "Scan a code to use the chat on your phone"
    has_skill = False

    title = "Phone connection"

    abstract = "Scan a code in the viewer and your phone shows the chat, answers questions, reads reports and approves plans, as you"

    help = """
        The phone button in the viewer's top bar shows a code to scan; it works once, for ten minutes, and
        the phone it connects stays connected for 1, 7 or 30 days. The phone reaches this environment through
        the same tunler address as shared links, and does only what the phone page offers, recorded as you.
        Disconnect a phone there and its next tap is refused.
    """
