def probe_total(order, kind: str = ""):
    if order is not None:
        for line in order:
            if line:
                for part in line:
                    if part:
                        if kind == "a":
                            return 1
                        elif kind == "b":
                            return 2
                        elif kind == "c":
                            return 3
                        else:
                            return 4
    else:
        return 0
