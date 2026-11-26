# Tiered search

Every domain's search provider shares one bounded tiered search (`App\Search\TieredSearch`).

1. A high-water id is fixed on the first call, so later calls never see rows made after it.
2. A complete reference is answered first, at tier 500.
3. Rows are then read in blocks of at most 32, in binary id order, tier by tier from an exact title down to a title
   that contains the words. Each block is narrowed by its LIKE pattern and gives only rows whose highest tier is the
   tier being visited, so every hit of a batch is certified.
4. For a source with a long text, the texts the pattern matches are read in fixed segments that overlap by the words'
   length, so a phrase across a segment edge is still found.
5. A refresh rereads the held records in bulk and answers those that still match.
