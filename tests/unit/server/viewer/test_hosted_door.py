from dataclasses import replace

import pytest

from server.enums.closed_service import ClosedService
from server.viewer.door_request import DoorRequest
from server.viewer.hosted_closed_doors import CLOSED_PATHS, CLOSED_PHONE_FILES, CLOSED_PREFIX, HostedClosedDoors
from server.viewer.hosted_door import ANONYMOUS_BODY_BYTES, HostedDoor
from server.viewer.open_doors import OpenDoors

PUBLIC_ORIGIN = "https://journal.example.com"
PROXY_UID = 501
EQUAL_ORIGIN_REQUEST = DoorRequest(PROXY_UID, "journal.example.com", PUBLIC_ORIGIN, "same-origin", True, False, 10)
CLOSED_ROUTES = (*CLOSED_PATHS, *CLOSED_PHONE_FILES, f"{CLOSED_PREFIX}token")


def status(request: DoorRequest) -> int | None:
    refusal = HostedDoor(PUBLIC_ORIGIN, PROXY_UID).refusal(request)
    return None if refusal is None else refusal.status


def test_a_caller_that_is_not_the_proxy_is_refused_403():
    assert status(replace(EQUAL_ORIGIN_REQUEST, peer_uid=PROXY_UID + 1)) == 403


def test_a_request_naming_another_host_is_refused_403():
    assert status(replace(EQUAL_ORIGIN_REQUEST, host="evil.example")) == 403


@pytest.mark.parametrize("origin, site", [("https://evil.example", "cross-site"), ("", "")])
def test_a_change_from_another_origin_or_with_no_origin_header_is_refused_403(origin, site):
    assert status(replace(EQUAL_ORIGIN_REQUEST, origin=origin, site_relation=site)) == 403


def test_a_same_origin_change_passes_the_door_for_the_login_check():
    assert status(EQUAL_ORIGIN_REQUEST) is None


def test_a_large_body_from_someone_not_logged_in_is_refused_413():
    assert status(replace(EQUAL_ORIGIN_REQUEST, body_bytes=ANONYMOUS_BODY_BYTES + 1)) == 413


def test_a_read_with_no_origin_headers_passes_the_door():
    assert status(replace(EQUAL_ORIGIN_REQUEST, is_change=False, origin="", site_relation="")) is None


@pytest.mark.parametrize("path", sorted(CLOSED_ROUTES))
def test_a_hosted_journal_closes_login_links_phone_pairing_and_share_routes_and_a_local_one_does_not(path):
    assert HostedClosedDoors().closes_route(path, {}) and not OpenDoors().closes_route(path, {})


def test_a_login_by_link_on_the_root_is_closed_on_a_hosted_journal():
    assert HostedClosedDoors().closes_route("/", {"key": ["anything"]}) and not HostedClosedDoors().closes_route("/", {})


def test_a_hosted_journal_starts_no_tunnel_and_no_plugin_part_and_a_local_one_starts_every_part():
    assert all(HostedClosedDoors().closes_service(service) for service in (ClosedService.TUNNEL, ClosedService.PLUGIN_SERVICES, ClosedService.PLUGIN_SCRIPTS))
    assert not any(OpenDoors().closes_service(service) for service in ClosedService)
