from __future__ import annotations

from payloads.base import Field, Payload
from payloads.common import ListingPayload, WherePayload


class ListPayload(ListingPayload):
    open = Field(bool)
    order_by_id = Field(bool)


class StorePayload(WherePayload):
    title = Field(str)
    body = Field(str, verbatim=True)
    after = Field(str)
    needs = Field(str)


class UpdatePayload(Payload):
    title = Field(str)
    body = Field(str, verbatim=True)
    priority = Field(str)


class HowPayload(Payload):
    how = Field(str)


class StartPayload(WherePayload):
    agent = Field(str, key="as")


class AskPayload(Payload):
    question = Field(str)


class AfterPayload(Payload):
    names = Field(str)
    none = Field(bool)


class ReportPayload(Payload):
    how = Field(str)
    agent = Field(str, key="as")


class PriorityPayload(Payload):
    value = Field(str)


class PrunePayload(Payload):
    older_than = Field(str)
    before = Field(str)
    force = Field(bool)


class CommitPayload(Payload):
    ref = Field(str)
