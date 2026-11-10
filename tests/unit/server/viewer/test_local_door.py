import pytest

from server.viewer.door_request import DoorRequest
from server.viewer.local_door import WRONG_HOST_REASON, LocalDoor

OWN_HOST = "127.0.0.1:8420"
TUNNEL_ADDRESS = "https://shop.tunnel.example"


def request(host: str) -> DoorRequest:
    return DoorRequest(0, host, "", "", False, False, 0)


def door(tunnel_address: str | None) -> LocalDoor:
    return LocalDoor(OWN_HOST, lambda: tunnel_address)


@pytest.mark.parametrize("host", [OWN_HOST, "shop.tunnel.example"], ids=["its own address", "the address of its open tunnel"])
def test_a_request_under_an_address_of_this_listener_is_let_in(host):
    assert door(TUNNEL_ADDRESS).refusal(request(host)) is None


@pytest.mark.parametrize("host, tunnel_address", [("other.example", TUNNEL_ADDRESS), ("shop.tunnel.example", None)], ids=["another host", "the tunnel's host while no tunnel is open"])
def test_a_request_under_any_other_address_is_refused(host, tunnel_address):
    refusal = door(tunnel_address).refusal(request(host))
    assert (refusal.status, refusal.reason) == (403, WRONG_HOST_REASON)


def test_only_a_request_from_this_machine_reads_the_server_state_without_a_login():
    assert not door(TUNNEL_ADDRESS).state_needs_login(request(OWN_HOST))
    assert door(TUNNEL_ADDRESS).state_needs_login(request("shop.tunnel.example"))
