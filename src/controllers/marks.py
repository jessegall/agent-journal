def internal(fn):
    fn.internal = True
    return fn


def lasting(fn):
    fn.network = True
    return fn
