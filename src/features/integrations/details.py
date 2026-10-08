from features.base import FeatureDetails
from features.groups import Group
from features.settings import Setting
from resources.base import PROJECT


class IntegrationDetails(FeatureDetails):
    """What every integration shares: off until you switch it on, kept once for the project, and a key you pick from your secrets."""

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
    ]
