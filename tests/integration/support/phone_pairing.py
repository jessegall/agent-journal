PAIR_LINE = {"window": "phone.phones", "line": ["phone", "pair"], "environment": "main"}


# Ada logs in at the computer and asks for a pairing code: her cookie and the code's row
def paired_code(server) -> tuple[str, dict[str, object]]:
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    return cookie, server.viewer_line_value(cookie, PAIR_LINE)
