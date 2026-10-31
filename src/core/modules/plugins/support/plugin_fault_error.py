class PluginFaultError(Exception):
    """A plugin's program ran past its limit, ended with an error code, or printed an answer that is not JSON."""
