from typing import TypedDict

# version 2 of the block contract a plugin reads beside the version 1 row of a block's event; the keys are the contract's
PluginBlockFields = TypedDict("PluginBlockFields", {"version": int, "scope_tools": object, "scope_stop": object, "ends": object, "waived_by": object,
                                                    "closed_reason": object, "escalation_id": object, "stop_deferred": bool})
