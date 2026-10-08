from typing import ClassVar

from features.base import FeatureDetails
from features.groups import Group
from features.settings import Setting
from resources.base import PROJECT

REFUSED, UNREACHABLE = "refused", "unreachable"
SEND, KEEP = "Send", "Don't send"


class IntegrationDetails(FeatureDetails):
    """What every integration shares: off until you switch it on, kept once for the project, and a key you pick from your secrets."""

    mcp_server: ClassVar[str] = ""
    group = Group.INTEGRATIONS
    has_skill = False
    default = False
    scope = PROJECT

    settings = [
        Setting(
            name="key",
            default="",
            title="Key",
            abstract="The secret this integration signs in with. Only you pick it, from your secrets",
            scope=PROJECT,
            secret=True,
        ),
        Setting(
            name="use_mcp",
            default=False,
            title="Agents can use it directly",
            abstract="Gives each agent the service's own tools. What an agent reads there is not marked as untrusted. Off unless you turn it on",
            scope=PROJECT,
        ),
        Setting(name="fetching", default=True, title="Read it into tickets", abstract="The journal reads the service and keeps what it finds as tickets", scope=PROJECT),
    ]
