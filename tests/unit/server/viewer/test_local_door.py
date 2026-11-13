import pytest

from server.viewer.door_request import DoorRequest
from server.viewer.local_door import OTHER_SITE_REASON, WRONG_HOST_REASON, LocalDoor

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


def change(host: str, origin: str, site_relation: str) -> DoorRequest:
    return DoorRequest(0, host, origin, site_relation, True, True, 0)


@pytest.mark.parametrize("origin, site_relation", [("http://127.0.0.1:5173", "same-site"), ("https://other.example", "cross-site"), (f"http://{OWN_HOST}", "same-site")],
                         ids=["another port of this machine", "another site", "its own origin named as only the same site"])
def test_a_change_from_another_origin_is_refused_though_it_names_this_address(origin, site_relation):
    refusal = door(TUNNEL_ADDRESS).refusal(change(OWN_HOST, origin, site_relation))
    assert (refusal.status, refusal.reason) == (403, OTHER_SITE_REASON)


@pytest.mark.parametrize("host, origin, site_relation", [(OWN_HOST, f"http://{OWN_HOST}", "same-origin"), ("shop.tunnel.example", TUNNEL_ADDRESS, "same-origin"), (OWN_HOST, "", "")],
                         ids=["the viewer's own page", "the page through the tunnel", "a script that names no origin"])
def test_a_change_from_its_own_origin_or_from_a_script_is_let_in(host, origin, site_relation):
    assert door(TUNNEL_ADDRESS).refusal(change(host, origin, site_relation)) is None
