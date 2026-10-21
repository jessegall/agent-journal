class PathOverlap:
    """Whether two sets of paths name a file in common: a full path and a bare file name match when one ends with the other."""

    @staticmethod
    def exists(files, paths) -> bool:
        return any(file.endswith(path) or path.endswith(file) for file in files for path in paths)
