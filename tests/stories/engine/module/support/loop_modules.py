from engine.module.module import Module


class LoopFirst(Module):
    name = "folder.loop-first"
    requires_engine = ">=7,<8"
    dependencies = ["folder.loop-first"]
