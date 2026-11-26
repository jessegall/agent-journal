# The shell corpus

## Import

`tools/processes/import-shell-corpus.php <version-5 checkout>` builds the portable shell corpus in
`tests/Fixtures/Processes/ShellCorpus` from version 5's checked-in fixtures: every splitter line, every recorded
correction, every distilled command shape and chain, the 500-case seed-7 sample, one deterministic case per shape with
its optional pieces kept and dropped, wrapper and redirect boundaries, and the synthetic adversarial cases. Cases are
deduplicated by source, dialect and context, keeping every origin. The expected block stays empty until the structural
expectations are frozen; `decisions.jsonl` starts empty.

The seed-7 sample comes from `tools/processes/generated-sample-seed-7.jsonl`, exported once by a test run in a scratch
copy of version 5's own hook module, because PHP's random numbers cannot reproduce Go's PCG.

## Qualification

`tools/processes/qualify-shell-corpus.php` reads every private corpus source in `../shell-corpus-private` (outside the
project), deduplicates the lines by source and dialect and splits them into deterministic chunks. For each chunk it
compares the journal's reading (`tools/processes/analyse-shell-lines.php`, run in the app container) with the
independent reference (`tools/shell-oracle`, mvdan.cc/sh). A cursor tied to the input hash lets a killed run resume
after its last complete chunk. Private details (the sources of differing lines) stay in
`../shell-corpus-private/qualification`; the public report holds counts, hashes, elapsed time and opaque ids only.
Without the corpus or the oracle it reports qualification not run and exits nonzero, never a pass.
