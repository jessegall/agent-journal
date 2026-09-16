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


class AutoPayload(Payload):
    state = Field(str)
