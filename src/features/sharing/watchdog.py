import time

from controllers.types import Messages
from controllers.stored import mtime
from engine.keeper import READY, STARTING
from engine.services import UP, log_file, status, want
from engine.sessions import alive
from engine.state import State
from engine.ports import reached, vouched
from features.sharing.address import relied_on
from features.sharing.controller import HEALTH, HEALTH_MARKER, Shares
from features.sharing.details import HOST_DOWN, RESTARTED
from features.sharing.services import SERVER, TUNNEL, wanted
from features.sharing.tunnel import ADDRESS_REFUSED, READDRESSED, SIGNED_OUT, alerts, default_route, held_by_server, refused_address, tunler_status
from resources.base import SYSTEM, Refused

MISSES_BEFORE_RESTART = 2
CHECK_SECONDS = 5.0
PARTS = {SERVER: "server", TUNNEL: "tunnel"}
RESTART_GAPS = (30.0, 60.0, 120.0, 300.0)
HELD_RETRY = 12.0
JUMP_SECONDS = 20.0
SLEEP_GAP = 60.0
READDRESS = {"label": "Choose a new address", "type": "share", "action": "readdress"}
SETTINGS_UNREADABLE, HOST_IS_DOWN, TUNLER_UNUSABLE = "settings_unreadable", "host_down", "tunler_unusable"
MISSES, RESTARTED_AT, UNREACHABLE_SINCE, RESTARTS = "misses", "restarted", "unreachable_since", "restarts"
HOLD_FOR = 60.0


class TunnelWatch:
    def __init__(self, feature):
        self.feature = feature
        self.wall, self.steady, self.route = time.time(), time.monotonic(), ""

    def moved(self) -> bool:
        wall, steady, route = time.time(), time.monotonic(), default_route()
        slept = abs((wall - self.wall) - (steady - self.steady)) > JUMP_SECONDS or wall - self.wall > SLEEP_GAP
        rerouted = bool(route and self.route and route != self.route)
        self.wall, self.steady, self.route = wall, steady, route or self.route
        return slept or rerouted

    def __call__(self, shares: Shares) -> None:
        record, moved = shares.record, self.moved()
        if not wanted(record.root):
            return
        state = alerts(record.root)
        if unusable := shares._unusable(tunler_status()):
            alert_once(state, TUNLER_UNUSABLE, lambda: Messages(record, actor=SYSTEM).create("The tunnel cannot start", brief=unusable))
            return
        state.set(TUNLER_UNUSABLE, 0)
        if state.get(SIGNED_OUT):
            state.set(SIGNED_OUT, 0)
            want(record.root, TUNNEL, UP, nonce=time.time())
        if refused_address(log_file(record.root, TUNNEL)):
            self.refused(shares, state)
            return
        state.set(ADDRESS_REFUSED, 0)
        try:
            answering = shares._answering(CHECK_SECONDS)
        except Refused as error:
            unreadable = str(error)
            alert_once(state, SETTINGS_UNREADABLE, lambda: Messages(record, actor=SYSTEM).create(
                "The tunnel address cannot be read", buttons=[READDRESS],
                brief=f"{unreadable}. The address has not changed; choosing a new one means pairing the phone again."))
            return
        state.set(SETTINGS_UNREADABLE, 0)
        if answering:
            for key in (MISSES, HOST_IS_DOWN, UNREACHABLE_SINCE, RESTARTS, READDRESSED):
                state.set(key, 0)
            return
        state.set(UNREACHABLE_SINCE, float(state.get(UNREACHABLE_SINCE, 0)) or time.time())
        misses = int(state.get(MISSES, 0)) + 1
        state.set(MISSES, misses)
        if not moved and not self.due(state, misses, record.root):
            return
        state.set(MISSES, 0)
        if not moved and not reached(f"https://{shares._host()}/", CHECK_SECONDS):
            alert_once(state, HOST_IS_DOWN, lambda: self.feature.to_primary(record, HOST_DOWN, host=shares._host()))
            return
        down = TUNNEL if serving(record.root) else SERVER
        want(record.root, down, UP, nonce=time.time())
        state.set(RESTARTED_AT, time.time())
        state.set(RESTARTS, int(state.get(RESTARTS, 0)) + 1)
        self.feature.to_primary(record, RESTARTED, misses=misses, part=PARTS[down])

    def refused(self, shares: Shares, state: State) -> None:
        record = shares.record
        if state.get(READDRESSED):
            alert_once(state, ADDRESS_REFUSED, lambda: Messages(record, actor=SYSTEM).create(
                "The tunnel address is owned by another user", buttons=[READDRESS],
                brief="The new address was refused as well. Choosing another one changes the phone's address, so it has to be paired again."))
            return
        state.set(READDRESSED, time.time())
        name = shares._readdress()
        if relied_on(record):
            Messages(record, actor=SYSTEM).create("The tunnel moved to a new address", brief=(
                f"Another tunler account owns the old address, so the journal chose {name} and restarted the tunnel on it. "
                "Share links sent before now stop working: send them again. A paired phone has to be paired again."))

    def due(self, state: State, misses: int, root) -> bool:
        since = time.time() - float(state.get(RESTARTED_AT, 0))
        if tunnel_holding(root):
            return since >= HELD_RETRY
        return misses >= MISSES_BEFORE_RESTART and since >= RESTART_GAPS[min(int(state.get(RESTARTS, 0)), len(RESTART_GAPS) - 1)]


def alert_once(state: State, key: str, alert) -> None:
    if not state.get(key):
        state.set(key, time.time())
        alert()


def tunnel_holding(root) -> bool:
    kept, log = status(root, TUNNEL), log_file(root, TUNNEL)
    fresh = time.time() - mtime(log) / 1e9 < HOLD_FOR
    return fresh and held_by_server(log) and kept.state in (STARTING, READY) and alive(kept.pgid)


def serving(root) -> bool:
    port = status(root, SERVER).port
    return bool(port) and vouched(f"http://127.0.0.1:{port}/{HEALTH}", HEALTH_MARKER, CHECK_SECONDS)
