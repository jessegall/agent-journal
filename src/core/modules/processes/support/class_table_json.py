from typing import TypedDict

# one execution class as the class table sends it to the viewer; the keys are the viewer's
ClassTableJson = TypedDict("ClassTableJson", {"name": str, "lane": str, "cost": int, "priority": str, "limit": int, "pattern": str, "plugin": str, "origin": str})
