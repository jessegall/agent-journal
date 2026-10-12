from framework.held_lines import taken


def lines_held(call) -> str:
    """What the agent's tags did, handed over on the hook's own answer and forgotten."""
    return "".join(f"[journal] {line}\n" for line in taken(call.record, call.session))
