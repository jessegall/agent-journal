import hashlib
import io
import secrets

from core.base.actor import Actor
from core.base.caller.caller import Caller
from core.base.cli.line_run import LineRun
from core.base.container import Container
from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from server.endpoints.cli_endpoint import CLI_LIMIT_SECONDS
from server.listener_thread import ListenerThread
from server.listener_wake import ListenerWake
from server.viewer.paired_phone import PairedPhone
from server.viewer.phone_module_error import PhoneModuleError
from server.viewer.wrong_code_limit import WrongCodeLimit

TOKEN_BYTES = 24


class PhoneSessions:
    """The viewer's way to the phone module: it redeems a phone's code for a session token, keeping only the
    token's digest in the journal, and finds the person a token's paired phone acts for, so a phone stays
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
        return hashlib.sha256(token.encode()).hexdigest()
