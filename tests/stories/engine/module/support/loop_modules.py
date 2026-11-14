from engine.module.module import Module


class LoopFirst(Module):
    name = "folder.loop-first"
    requires_engine = ">=5,<6"
    dependencies = ["folder.loop-first"]
