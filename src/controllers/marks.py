def action(fn=None, *, network: bool = False):
    def marked(f):
        f.action = True
        if network:
            f.network = True
        return f
    return marked(fn) if fn else marked
