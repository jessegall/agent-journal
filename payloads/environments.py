from __future__ import annotations

from payloads.base import Field, Payload


class SettingsPayload(Payload):
    # auto is NOT here: the switch belongs to the journal, not to one environment (/api/journal/settings)
    reports_archive_days = Field(int)
    todos_archive_days = Field(int)
    activity_show = Field(int)
    activity_keep = Field(int)
    viewer_first = Field(bool)
    retention = Field(dict)
    always_load = Field(str)
    always_on = Field(bool)


class RemovePayload(Payload):
    confirm = Field(str)
    yes = Field(bool)
    session = Field(str)


class MakePayload(Payload):
    #: the NAME IS IN THE BODY, not in the path: a path is routed against the environments that
    #: exist, so a new one could never be named there without special-casing the router.
    name = Field(str)


class AssignPayload(Payload):
    #: a session's stem, or enough of its start to be one session and not two
    session = Field(str)


class AutoPayload(Payload):
    state = Field(str)
