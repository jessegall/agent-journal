# Batch moves

`batch-move.php` moves a whole batch of classes from the abstract syntax tree alone. Every PHP file of the project is
parsed once and held in memory with its names resolved to full classes; the batch's rename map is applied to those
trees, each change an edit at the exact position of a node, and each touched file is written once. The files move with
`git mv` afterwards.

A line of `moves.txt` is `Old\Class New\Class old/path.php new/path.php`, with `merge` after it when New already
exists: every reference then names New and the old file is deleted instead of moved.

From the tree it rewrites:

- the namespace name of a moved file;
- each import of a moved class; an import of a class in the moved file's own new namespace goes;
- each qualified name of a moved class, and the short name where a move renames a class;
- an import, after the last import node, for each class a file named bare through its namespace that is no longer
  beside it;
- inside string and comment nodes, a moved class's full name or old file path.

Files that are not PHP, such as the docs, get the full class names and old file paths rewritten. It fails, naming them,
on a file that no longer parses or a node that still names an old class.
