# Dashboard cold startup

The dashboard was unavailable after the 2.252.0 and 2.253.0 updates and returned after the journal was started in the same interpreter as the native project scan. The two recoveries scanned 132,786 files in 42.324 seconds and 132,787 files in 36.386 seconds; following dashboard requests took 0.010 and 0.005 seconds, with an independent second request at 0.012 seconds.

The cold cache was process-local, and those releases walked the project synchronously while the first viewer request could arrive. The recovery observations establish ordering and contention, but do not measure duplicate live walks or attribute filesystem contention to one Python operation. The separate three-file profile is not a live latency measurement. An incomplete About source handover and a wrapper launch-lock bug are separate findings.

Release 2.254.12 changed startup indexing to a background single-flight walk, so this note records the incident and its regression contract. The implementation lives in `src/engine/project_files.py`; the formatter path is `src/features/row_links/paths.py`. Run the isolated regression with `PYTHONPATH=src PYTHONDONTWRITEBYTECODE=1 python3 -B -m pytest src/features/row_links/test.py -q -o "addopts=-p no:cacheprovider" -k cold_project_indexing_is_shared_while_the_viewer_keeps_answering`. It holds the native walk, confirms two concurrent viewer formatting requests complete without inventing a file chip, verifies one walk is shared, and then confirms the published native result resolves the actual file.

Both official packages were pristine, and authentication was unchanged. These facts are retained as incident evidence; this note contains no local paths, account identifiers or raw logs.
