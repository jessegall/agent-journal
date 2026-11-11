class AssignmentLink:
    """A model whose rows link a child row to its parent for assignments: an assignable model names it as the
    link model of its children. A link row made later lets the child inherit the parent's assignment, and a
    link row removed takes that inherited assignment away."""
