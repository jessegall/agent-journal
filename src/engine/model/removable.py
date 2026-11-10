class Removable:
    """A model whose rows can be removed, marked by removed_at. Lists and queries leave removed rows out; a read
    that needs them asks with Query.with_removed, and a row asked for by its id is always found."""
