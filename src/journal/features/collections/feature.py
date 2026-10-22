from journal.features.collections.commands.collection_command import CollectionCommand
from journal.features.feature import Feature
from journal.support.skill import Skill


class CollectionsFeature(Feature):
    name = "collections"
    title = "Collections"
    help = "Rows that belong together are kept in a named collection, shown as cards."
    commands = (CollectionCommand,)

    skill = Skill("collections", 'Gather rows that belong together into a named collection; load it when rows of one subject or one effort sit apart', """
# Collections

A collection is a row of its own whose links are its members, rows of any type; a row can sit in several.

- `journal collection create "<name>" --abstract "<what belongs in it>"` makes one.
- `journal collection add <n> <ref> [<ref> ...]` puts rows in it, each as table:id (`docs:41`, `tasks:785`,
  `messages:2706`); `journal collection remove <n> <ref>` takes one out; `journal collection members <n>` lists them,
  leaving out a row that is gone; `journal collection list` names every collection; `journal collection rename <n> "<name>"`.
- When rows that belong together, documents on one subject or tasks of one effort, sit in no collection, make one,
  add them all, and say so in one line so the user can rename or remove it. A single row with nothing related gets no
  collection of its own, and a row the user took out of a collection is never put back.
- A dump files its items into a collection of its own, named with the dump.
""", keywords=('collection', 'collections', 'group', 'belong together'))
