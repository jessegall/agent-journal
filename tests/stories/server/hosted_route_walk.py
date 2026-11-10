import pytest

from server.door.hosted_journal_door import OWNER_REASON
from server.viewer import viewer_request_handler
from server.viewer.viewer_request_handler import CLOSED_DOOR_REASON, EVENTS_ROUTE, SERVER_STATE_ROUTE
from server.viewer.route_audience import RouteAudience
from server.viewer.viewer_route_rule import ViewerRouteRule
from server.viewer.viewer_route_rules import VIEWER_ROUTE_RULES
from tests.stories.server.support.hosted_viewer import PUBLIC_ORIGIN, agent_server, hosted_server, session_cookie, socket_answer, socket_path
from tests.stories.server.support.server_client import request_answer
from tests.stories.support.story_checks import expect_value

ORIGIN_HEADERS = {"Origin": PUBLIC_ORIGIN, "Sec-Fetch-Site": "same-origin"}
STREAMS = {EVENTS_ROUTE}


def rules_of(audience: RouteAudience) -> list[ViewerRouteRule]:
    return [rule for rule in VIEWER_ROUTE_RULES if rule.audience is audience]


def ids_of(rules: list[ViewerRouteRule]) -> list[str]:
    return [f"{rule.method} {rule.path}" for rule in rules]


def hosted_answer(server_and_path, rule: ViewerRouteRule, logged_in: bool):
    server, socket_path = server_and_path
    headers = {**(ORIGIN_HEADERS if rule.method == "POST" else {}), **(session_cookie(server) if logged_in else {})}
    return socket_answer(socket_path, rule.method, rule.example_path, headers=headers, body="{}" if rule.method == "POST" else "")


def path_constants() -> list[str]:
    paths = [value for name, value in vars(viewer_request_handler).items() if name.isupper() and isinstance(value, str) and value.startswith("/")]
    phone_files = [f"{viewer_request_handler.VIEWER_ROOT}{name}" for name in viewer_request_handler.PHONE_FILES]
    return sorted({*paths, *phone_files})


def test_every_path_the_viewer_handler_names_has_a_rule_that_states_who_may_reach_it():
    ruled = {rule.path for rule in VIEWER_ROUTE_RULES}
    expect_value([path for path in path_constants() if path not in ruled], [])


@pytest.mark.parametrize("rule", rules_of(RouteAudience.PUBLIC_FILES), ids=ids_of(rules_of(RouteAudience.PUBLIC_FILES)))
def test_a_public_file_is_answered_to_a_caller_who_is_not_logged_in(hosted_server, rule):
    expect_value(hosted_answer(hosted_server, rule, logged_in=False).status != 401, True)


@pytest.mark.parametrize("rule", rules_of(RouteAudience.SESSION), ids=ids_of(rules_of(RouteAudience.SESSION)))
def test_a_logged_in_route_answers_401_without_a_login(hosted_server, rule):
    expect_value(hosted_answer(hosted_server, rule, logged_in=False).status, 401)


@pytest.mark.parametrize("rule", [rule for rule in rules_of(RouteAudience.SESSION) if rule.path not in STREAMS], ids=lambda rule: f"{rule.method} {rule.path}")
def test_a_logged_in_route_does_not_answer_401_with_a_login(hosted_server, rule):
    expect_value(hosted_answer(hosted_server, rule, logged_in=True).status != 401, True)


@pytest.mark.parametrize("rule", rules_of(RouteAudience.CLOSED_HOSTED), ids=ids_of(rules_of(RouteAudience.CLOSED_HOSTED)))
def test_a_closed_route_answers_404_even_with_a_login(hosted_server, rule):
    answer = hosted_answer(hosted_server, rule, logged_in=True)
    expect_value((answer.status, CLOSED_DOOR_REASON in answer.text), (404, True))


@pytest.mark.parametrize("rule", rules_of(RouteAudience.JOURNAL_USER), ids=ids_of(rules_of(RouteAudience.JOURNAL_USER)))
def test_a_route_of_the_journal_user_answers_403_to_another_user(agent_server, rule):
    answer = request_answer(agent_server.socket_path, rule.method, rule.example_path, {})
    expect_value((answer.status, OWNER_REASON in answer.text), (403, True))


def test_the_server_state_answers_401_without_a_login_and_200_with_one_on_a_hosted_journal(hosted_server):
    server, socket_path = hosted_server
    expect_value(socket_answer(socket_path, "GET", SERVER_STATE_ROUTE).status, 401)
    expect_value(socket_answer(socket_path, "GET", SERVER_STATE_ROUTE, headers=session_cookie(server)).status, 200)
