from core.base.seed.demo_link import DemoLink, FORBIDDEN_PORTS


def test_the_login_link_names_the_viewer_port_and_the_key():
    assert DemoLink.build(51234, "abc123", "demo") == "http://127.0.0.1:51234/?key=abc123&environment=demo"


def test_a_port_in_the_range_of_the_journals_own_servers_is_refused():
    assert FORBIDDEN_PORTS == range(8420, 8430)
    assert DemoLink.is_allowed(51234) and not DemoLink.is_allowed(8420) and not DemoLink.is_allowed(8429) and DemoLink.is_allowed(8430)
