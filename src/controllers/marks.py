def action(fn=None, *, network: bool = False, here: bool = False):
    def marked(f):
        f.action = True
        if network:
            f.network = True
        if here:
            f.here = True
        return f
    return marked(fn) if fn else marked
