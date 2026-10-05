import time

from engine import runtime
from engine.events.engine import ClockTicked
from controllers.types import Messages
from engine.keeper import READY, STARTING
from engine.services import UP, log_file, status, want
from engine.sessions import alive
from engine.state import State
from features.parts import Context, Handler
from engine.ports import answers, reached
from features.sharing.controller import HEALTH, Shares
from features.sharing.details import HOST_DOWN, RESTARTED
from features.sharing.services import SERVER, TUNNEL, wanted
from features.sharing.tunnel import held_by_server, refused_address, tunler
from resources.base import SYSTEM, Refused

MISSES_BEFORE_RESTART = 3
PATIENCE = 30.0
PARTS = {SERVER: "server", TUNNEL: "tunnel"}
RESTART_EVERY = 300.0
READDRESS = {"label": "Choose a new address", "type": "share", "action": "readdress"}
ADDRESS_REFUSED, SETTINGS_UNREADABLE, HOST_IS_DOWN = "address_refused", "settings_unreadable", "host_down"
MISSES, RESTARTED_AT = "misses", "restarted"


class KeepTunnelAnswering(Handler):
    def handle(self, context: Context, event: ClockTicked) -> None:
        if context.record.env != runtime.env(context.record.root):
            return
        if not wanted(context.record.root) or not tunler():
            return
        state, shares = State(context.record.root / "runtime" / "sharing-tunnel.json"), Shares(context.record, actor=SYSTEM)
        if refused_address(log_file(context.record.root, TUNNEL)):
            alert_once(state, ADDRESS_REFUSED, lambda: Messages(context.record, actor=SYSTEM).create(
                "The tunnel address is owned by another user", buttons=[READDRESS],
                brief="The phone and share links cannot use this address. Choosing a new one changes the phone's address, so it has to be paired again."))
            return
        state.set(ADDRESS_REFUSED, 0)
        try:
            answering = shares._answering(PATIENCE)
        except Refused as error:
            unreadable = str(error)
            alert_once(state, SETTINGS_UNREADABLE, lambda: Messages(context.record, actor=SYSTEM).create(
                "The tunnel address cannot be read", buttons=[READDRESS],
                brief=f"{unreadable}. The address has not changed; choosing a new one means pairing the phone again."))
            return
        state.set(SETTINGS_UNREADABLE, 0)
        if answering:
            state.set(MISSES, 0)
            state.set(HOST_IS_DOWN, 0)
            return
        misses = int(state.get(MISSES, 0)) + 1
        state.set(MISSES, misses)
        if misses < MISSES_BEFORE_RESTART or time.time() - float(state.get(RESTARTED_AT, 0)) < RESTART_EVERY:
            return
        state.set(MISSES, 0)
        speaking = context.to_primary()
        if not reached(f"https://{shares._host()}/", PATIENCE):
            alert_once(state, HOST_IS_DOWN, lambda: speaking and speaking.agent.say(HOST_DOWN, host=shares._host()))
            return
        down = TUNNEL if serving(context.record.root) else SERVER
        if down == TUNNEL and tunnel_holding(context.record.root):
            return
        want(context.record.root, down, UP, nonce=time.time())
        state.set(RESTARTED_AT, time.time())
        if speaking:
            speaking.agent.say(RESTARTED, misses=MISSES_BEFORE_RESTART, part=PARTS[down])


def alert_once(state: State, key: str, alert) -> None:
    if not state.get(key):
        state.set(key, time.time())
        alert()


def tunnel_holding(root) -> bool:
    kept = status(root, TUNNEL)
    return held_by_server(log_file(root, TUNNEL)) or (kept.state in (STARTING, READY) and alive(kept.pgid))


def serving(root) -> bool:
    port = status(root, SERVER).port
    return bool(port) and answers(f"http://127.0.0.1:{port}/{HEALTH}")
