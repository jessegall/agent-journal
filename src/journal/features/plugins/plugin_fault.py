class PluginFault(Exception):
    """A plugin that failed to answer: timed out, crashed, exited badly or answered what does not parse. A fault lets the event through; it is never a refusal."""
