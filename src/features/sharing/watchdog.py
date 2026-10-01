import time

from engine import runtime
from engine.events.engine import ClockTicked
from controllers.types import Nudges
from engine.services import UP, log_file, status, want
from engine.state import State
from features.parts import Context, Handler
from features.sharing.controller import HEALTH, Shares, answers
from features.sharing.services import SERVER, TUNNEL, wanted
from features.sharing.tunnel import readdressed, refused_address, tunler
from resources.base import SYSTEM

MISSES_BEFORE_RESTART = 3
PATIENCE = 10.0
PARTS = {SERVER: "server", TUNNEL: "tunnel"}
RESTART_EVERY = 300.0


class KeepTunnelAnswering(Handler):
    def handle(self, context: Context, event: ClockTicked) -> None:
        if context.record.env != runtime.env(context.record.root):
            return
        if not wanted(context.record.root) or not tunler():
            return
        if refused_address(log_file(context.record.root, TUNNEL)):
            readdressed(context.record.root)
            want(context.record.root, TUNNEL, UP, nonce=time.time())
            return
        state = State(context.record.root / "runtime" / "sharing-tunnel.json")
        if Shares(context.record, actor=SYSTEM)._answering(PATIENCE):
            state.set("misses", 0)
            return
        misses = int(state.get("misses", 0)) + 1
        state.set("misses", misses)
        if misses >= MISSES_BEFORE_RESTART and time.time() - float(state.get("restarted", 0)) >= RESTART_EVERY:
            down = TUNNEL if serving(context.record.root) else SERVER
            want(context.record.root, down, UP, nonce=time.time())
            state.set("restarted", time.time())
            state.set("misses", 0)
            Nudges(context.record, actor=SYSTEM)._to_primary(f"the phone's address did not answer twice, so its {PARTS[down]} was restarted")


def serving(root) -> bool:
    port = status(root, SERVER).port
    return bool(port) and answers(f"http://127.0.0.1:{port}/{HEALTH}")
