from collections.abc import Mapping

HOLD_MODEL = "agent_block"
HOLD_PROJECTION_VERSION = 2


class HoldProjection:
    """Version 2 of the hold contract a plugin reads beside the version 1 row (doc 1310 section 10.13): the
    scopes, the ends, who waived it, why it closed, how it was judged, its escalation, and whether an open
    escalation defers the stop it holds, so a plugin tells an open hold from one refusing the stop now."""

    @staticmethod
    def projected(row: Mapping[str, object]) -> dict[str, object]:
        is_open = row.get("closed_at") is None
        return {"version": HOLD_PROJECTION_VERSION, "scope_tools": row.get("scope_tools"), "scope_stop": row.get("scope_stop"), "ends": row.get("ends"),
                "waived_by": row.get("closer") if row.get("closed_reason") == "waived" else "", "closed_reason": row.get("closed_reason"),
                "judgement": row.get("judgement"), "escalation_id": row.get("escalation_id"),
                "stop_deferred": bool(is_open and row.get("scope_stop") and row.get("escalation_id") is not None)}
