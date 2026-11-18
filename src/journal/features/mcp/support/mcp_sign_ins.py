import threading
from http.client import HTTPConnection, HTTPException

from journal.features.mcp.support.agent_cli import AgentCli
from journal.features.mcp.support.callback_address import CallbackAddress
from journal.features.mcp.support.health import Health
from journal.features.mcp.support.mcp_installing import McpInstalling
from journal.features.mcp.support.sign_in_program import SignInProgram
from journal.features.mcp.support.waiting_sign_in import WaitingSignIn
from journal.providers.providers import Providers
from journal.support.rejection import Rejection

# how long a program may take to print its sign-in page, and to trade the code for its token once the browser came back
STARTING_SECONDS = 30
FINISHING_SECONDS = 30
RELAY_SECONDS = 10


class McpSignIns:
    """The sign-ins to MCP servers the journal runs itself, by the running agent's program: each prints the page the user signs in on, and the address the user's browser ends on is relayed to the program waiting on this machine, so a sign-in finishes even when the browser is on another computer."""

    def __init__(self, cli: AgentCli, providers: Providers, installing: McpInstalling, health: Health) -> None:
        self.cli, self.providers, self.installing, self.health = cli, providers, installing, health
        self.waiting: dict[str, WaitingSignIn] = {}
        self.lock = threading.Lock()

    def start(self, name: str) -> str:
        """Starts the sign-in to the server and returns the page the user signs in on; a sign-in already waiting for it is stopped."""
        self.stop(name)
        command = self.providers.lookup(self.installing.provider()).mcp_login_command(name)
        program = SignInProgram(*self.cli.in_terminal(command), lambda ended: self.settled(name, ended))
        authorization = program.authorization(STARTING_SECONDS)
        try:
            address = CallbackAddress.of(authorization)
        except Rejection:
            program.stop()
            raise
        with self.lock:
            self.waiting[name] = WaitingSignIn(program, address)
        return authorization

    def finish(self, name: str, pasted: str) -> None:
        """Hands the address the user's browser ended on to the program that waits for it, and refuses unless the program then signed in."""
        with self.lock:
            sign_in = self.waiting.get(name)
        if sign_in is None or sign_in.program.has_ended(0):
            raise Rejection(f"no sign-in to {name} is waiting: press Sign in first")
        answer = self.relayed(sign_in.address.port, sign_in.address.target(pasted))
        if not sign_in.program.has_ended(FINISHING_SECONDS):
            raise Rejection(f"the sign-in to {name} answered {answer} and is still waiting: open the sign-in page again")
        if not sign_in.program.succeeded():
            raise Rejection(f"the sign-in to {name} failed: {sign_in.program.said()}")

    def settled(self, name: str, program: SignInProgram) -> None:
        """A sign-in's end, however the browser reached it: a program signed in has the running agents restarted once idle, so they connect with it."""
        with self.lock:
            if name in self.waiting and self.waiting[name].program is program:
                del self.waiting[name]
        if program.succeeded():
            self.installing.applied()
            self.health.recheck()

    @staticmethod
    def relayed(port: int, target: str) -> int:
        connection = HTTPConnection("127.0.0.1", port, timeout=RELAY_SECONDS)
        try:
            connection.request("GET", target)
            return connection.getresponse().status
        except (OSError, HTTPException) as failed:
            raise Rejection(f"the sign-in program on port {port} could not be reached: {type(failed).__name__}") from failed
        finally:
            connection.close()

    def stop(self, name: str) -> None:
        with self.lock:
            sign_in = self.waiting.pop(name, None)
        if sign_in is not None:
            sign_in.program.stop()
