from dataclasses import dataclass

from journal.features.mcp.support.callback_address import CallbackAddress
from journal.features.mcp.support.sign_in_program import SignInProgram


@dataclass(frozen=True)
class WaitingSignIn:
    """A sign-in the journal started and the address on this machine its program waits on."""

    program: SignInProgram
    address: CallbackAddress
