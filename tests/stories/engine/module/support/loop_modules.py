from engine.module.module import Module


class LoopFirst(Module):
    name = "folder.loop-first"
    requires_engine = ">=6,<7"
    dependencies = ["folder.loop-first"]
