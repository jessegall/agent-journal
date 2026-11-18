# Memory

## What a memory is

A memory is something you must still know after a compaction: a short text kept at a weight. Only the agent that keeps a memory reads it.

## Weights

Every compaction of your session lowers each of your memories by one; at nought a memory is gone. A repeated report of the same compaction lowers nothing twice. Weigh a memory by how long you need it: work you still owe high, what you need only for the work in hand low.

## Keeping memories

- `memory:save "<text>" --weight <1 to 10>` keeps a memory; write what to do and when, not what happened, and name where it came from, such as the message or task number. A promise you cannot keep yet is kept at once and weighed high until it is done.
- `memory:list` lists your memories with their weights and revisions.
- `memory:edit <memory> --revision <revision>` changes its text or weight; name the revision you read, so a change made meanwhile is refused rather than overwritten.
- `memory:remove <memory>` removes one that is done or no longer true.

A retry after a failed attempt goes with `--request-key`, the key the failure printed, so nothing is saved twice.

## Numbers

Each memory takes the journal's next memory number, so you can name it as memory 12.
