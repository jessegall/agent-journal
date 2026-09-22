import features.groups.controller  # noqa: F401
from features.base import Feature
from features.groups.details import GroupsDetails


class GroupsFeature(Feature):
    details = GroupsDetails
