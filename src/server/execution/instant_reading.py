from typing import TypedDict

InstantReading = TypedDict("InstantReading", {"line": str, "class": str, "priority": str, "starter": str, "slot_cost": int, "seconds": float,
                                              "is_running": bool, "parent_line": str})
