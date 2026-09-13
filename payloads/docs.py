from __future__ import annotations

from payloads.base import Field, Payload
from payloads.common import ListingPayload, MovePayload as EnvironmentMove, WhyPayload


class ListPayload(ListingPayload):
    scope = Field(str)
    archived = Field(bool)


class StorePayload(Payload):
    title = Field(str)
    abstract = Field(str)
    body = Field(str, verbatim=True)
    project = Field(bool, key="global")


class UpdatePayload(Payload):
    title = Field(str)
    abstract = Field(str)
    status = Field(str)
    body = Field(str, verbatim=True)


class MovePayload(EnvironmentMove):
    project = Field(bool, key="global")


class SupersedePayload(Payload):
    new = Field(str)


class AttachPayload(Payload):
    path = Field(str, verbatim=True)
    title = Field(str)
    replace = Field(bool)


class DetachPayload(WhyPayload):
    name = Field(str)


class FilesPayload(Payload):
    pass


class SearchPayload(Payload):
    term = Field(str, verbatim=True)
    all = Field(bool)
