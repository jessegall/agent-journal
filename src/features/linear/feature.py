from features.integrations.base import IntegrationFeature
from features.linear.details import LinearDetails


class Linear(IntegrationFeature):
    details = LinearDetails
    host = "api.linear.app"
