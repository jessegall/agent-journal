import io
import json
import secrets

from engine.actor.actor import Actor
from engine.caller.caller import Caller
from engine.cli.line_run import LineRun
from engine.container.container import Container
from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from server.work.request_limits import CLI_LIMIT_SECONDS
from server.work.listener_thread import ListenerThread
from server.work.listener_wake import ListenerWake
from server.viewer.paired_phone import PairedPhone
from server.errors.phone_module_error import PhoneModuleError
from server.viewer.wrong_code_limit import WrongCodeLimit
from engine.text.text_digest import TextDigest
from core.modules.sharing.commands.make_share_link.make_share_link_handler import TOKEN_BYTES


class PhoneSessions:
    """The viewer's way to the phone module: it redeems a phone's code for a session token, keeping only the
    token's digest in the journal, and finds the user a token's paired phone acts for, so a phone stays
    logged in across restarts of the server and is logged out once it is unpaired."""

    def __init__(self, home: JournalHome, listener_thread: ListenerThread) -> None:
        self.line_run = LineRun(home, CLI_LIMIT_SECONDS, ListenerWake(listener_thread))
        self.wrong_codes = WrongCodeLimit()

    def paired_token(self, code: str) -> str:
        token = secrets.token_urlsafe(TOKEN_BYTES)
        self.journal_output(["phone", "redeem", code, "--token-digest", self.digest(token)])
        return token

    def person_id(self, token: str) -> int | None:
        try:
            return PairedPhone.parsed(self.journal_output(["phone", "session", self.digest(token)])).person_id
        except PhoneModuleError:
            return None

    def push_key(self) -> str:
        return str(json.loads(self.journal_output(["phone", "push-key"]))["line"])

    def subscribed(self, token: str, subscription: str) -> None:
        self.journal_output(["phone", "subscribe", self.digest(token), subscription])

    def journal_output(self, argv: list[str]) -> str:
        stream = io.StringIO()

        def core_caller(container: Container) -> Caller:
            return Caller(Actor.core())

        try:
            code = self.line_run.run_as([*argv, "--json"], core_caller, stream)
        except Refusal as refusal:
            raise PhoneModuleError(refusal.reason) from refusal
        if code != 0:
            raise PhoneModuleError(stream.getvalue().strip())
        return stream.getvalue()

    @staticmethod
    def digest(token: str) -> str:
        return TextDigest().hex_digest(token)
