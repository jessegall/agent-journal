import time

from engine import runtime
from engine.events.engine import ClockTicked
from engine.services import UP, log_file, want
from engine.state import State
from features.parts import Context, Handler
from features.sharing.controller import Shares
from features.sharing.services import TUNNEL, wanted
from features.sharing.tunnel import readdressed, refused_address, tunler
from resources.base import SYSTEM

MISSES_BEFORE_RESTART = 2
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
        if Shares(context.record, actor=SYSTEM)._answering():
            state.set("misses", 0)
            return
        misses = int(state.get("misses", 0)) + 1
        state.set("misses", misses)
        if misses >= MISSES_BEFORE_RESTART and time.time() - float(state.get("restarted", 0)) >= RESTART_EVERY:
            want(context.record.root, TUNNEL, UP, nonce=time.time())
            state.set("restarted", time.time())
            state.set("misses", 0)
