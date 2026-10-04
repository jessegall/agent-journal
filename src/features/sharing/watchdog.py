import time

from engine import runtime
from engine.events.engine import ClockTicked
from controllers.types import Nudges
from engine.services import UP, log_file, status, want
from engine.state import State
from features.parts import Context, Handler
from features.sharing.controller import HEALTH, Shares, answers, reached
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
        state, shares = State(context.record.root / "runtime" / "sharing-tunnel.json"), Shares(context.record, actor=SYSTEM)
        if shares._answering(PATIENCE):
            state.set("misses", 0)
            state.set("host_down", 0)
            return
        misses = int(state.get("misses", 0)) + 1
        state.set("misses", misses)
        if misses < MISSES_BEFORE_RESTART or time.time() - float(state.get("restarted", 0)) < RESTART_EVERY:
            return
        state.set("misses", 0)
        if not reached(f"https://{shares._host()}/", PATIENCE):
            if not state.get("host_down"):
                state.set("host_down", time.time())
                Nudges(context.record, actor=SYSTEM)._to_primary(f"the tunnel server {shares._host()} answers for no address",
                                                                 "the phone's address and share links are down until it is back; restarting "
                                                                 "here would not help, so nothing is restarted. Tell the user once.")
            return
        down = TUNNEL if serving(context.record.root) else SERVER
        want(context.record.root, down, UP, nonce=time.time())
        state.set("restarted", time.time())
        Nudges(context.record, actor=SYSTEM)._to_primary(f"the phone's address did not answer {MISSES_BEFORE_RESTART} times, so its {PARTS[down]} was restarted")


def serving(root) -> bool:
    port = status(root, SERVER).port
    return bool(port) and answers(f"http://127.0.0.1:{port}/{HEALTH}")
