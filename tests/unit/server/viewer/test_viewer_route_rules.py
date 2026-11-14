from server.viewer import viewer_request_handler
from server.viewer.viewer_route_rules import VIEWER_ROUTE_RULES


def path_constants() -> list[str]:
    paths = [value for name, value in vars(viewer_request_handler).items() if name.isupper() and isinstance(value, str) and value.startswith("/")]
    phone_files = [f"{viewer_request_handler.VIEWER_ROOT}{name}" for name in viewer_request_handler.PHONE_FILES]
    return sorted({*paths, *phone_files})


def test_every_path_the_viewer_handler_names_has_a_rule_that_states_who_may_reach_it():
    ruled = {rule.path for rule in VIEWER_ROUTE_RULES}
    assert [path for path in path_constants() if path not in ruled] == []
