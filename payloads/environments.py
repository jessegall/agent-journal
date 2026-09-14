from __future__ import annotations

from payloads.base import Field, Payload


class SettingsPayload(Payload):
    auto = Field(bool)
    reports_archive_days = Field(int)


class RemovePayload(Payload):
    confirm = Field(str)
    yes = Field(bool)
    session = Field(str)


class AutoPayload(Payload):
    state = Field(str)
