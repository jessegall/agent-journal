import time
from typing import ClassVar

from features.phone.passkey import PendingPasskey
from resources.base import OWNER_ID, PROJECT, Resource, ResourceDetails
from resources.shapes import NUMBER, TEXT, Field, Shape


class Phone(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Phone",
        abstract="A phone the user connected by scanning a code, which reads the chat and acts as the user from anywhere",
        help="The viewer's Connect your phone dialog shows the code; journal phone disconnect <n> cuts a phone off at once.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="environment"),
        Field(TEXT, OWNER_ID, name="member"),
        Field(name="journal"),
        Field(name="push"),
        Field(default=list, name="pushed"),
        Field(default=list, name="home"),
        Field(TEXT, name="key"),
        Field(TEXT, name="code"),
        Field(TEXT, name="short"),
        Field(NUMBER, default=0, name="code_until"),
        Field(NUMBER, default=0, name="tries"),
        Field(default=dict, name="picked"),
        Field(NUMBER, default=7, name="days"),
        Field(NUMBER, default=0, name="expires"),
        Field(NUMBER, default=0, name="last_seen"),
        Field(default=dict, name="passkey", journal_only=True),
        Field(default=dict, name="challenge", journal_only=True),
        Field(default=dict, name="unlock", journal_only=True),
        Field(default=dict, name="pending_passkey", journal_only=True),
    ]
    type = "phone"
    icon = "phone"
    scope = PROJECT
    takes_comments = False
    in_sidebar = False
    indexed = ("environment", "member", "key", "code", "short", "code_until", "expires", "last_seen")
    command_names = {"complete": "disconnect"}

    @property
    def connected(self) -> bool:
        return bool(self.key) and not self.completed and self.expires > time.time()

    @property
    def waiting_passkey(self) -> PendingPasskey:
        return PendingPasskey.from_json(self.pending_passkey)
