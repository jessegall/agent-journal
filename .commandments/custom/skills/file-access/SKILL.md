---
name: FileAccess
description: Read before reading or writing a file in core or a suite, or changing the file-access rules.
summary: FileAccess owns file reads and writes, caches unchanged contents, and invalidates the written path.
tier: mandatory
languages: [python]
---

# File access

Use `FileAccess.shared()` from `engine.file.file_access`. Read text with `read(path)` and bytes with
`binary(path)`. Write text with `write(path, text)` and bytes with `write_binary(path, data)`.
Use `writer(path, mode)` for a streamed write and `update_timestamp(path)` for a file touch.
Use `descriptor_writer(path, flags, permissions)` for atomic descriptor writes, `private_writer(path)`
for owner-only text files, and `replace(source, target)` for atomic replacement. Only this class opens
files for writing. A write invalidates that path, including after a streamed write.

The bounded cache keeps bytes by canonical path and modified time, size and inode. A read checks metadata
before using cached bytes. It preserves text encoding, error handling and newline conversion. A write
invalidates only its own path. A story request reports a second logical read of a path, even on a cache hit;
a write allows the next read of that path. Symlink paths count as their target.

## When it fires

- **file-reads**: a native file read bypasses FileAccess and is outside the named streaming exceptions.
- **file-writes**: a native file write bypasses FileAccess. There are no write exceptions.
- **log-outside-system-log-writer**: a `logging.getLogger` call or an append to a log file. Write a line of the system
  log with `SystemLogWriter.write`, which gives it its time, level and source for the System logs page. The one
  exception is `successor_start.py`, which hands the file to a new server's process as its output.

## Read exceptions

The following named lists in `custom/lists.json` hold the exact paths. Each list names its reason:

- `file_reads_process_output_uses_bounded_ranges`: output readers seek and read limited byte ranges.
- `file_reads_transcripts_seek_large_logs`: transcript readers seek and tail logs without retaining them whole.
- `file_reads_conflicts_stream_lines`: conflict detection stops at the first marker without loading each file whole.
- `file_reads_shell_uses_nonblocking_budget`: shell inspection rejects pipes and enforces a shared byte and line budget.
- `file_reads_shell_handoff_streams_child_output`: command handoff streams temporary child output line by line.
- `file_reads_release_archives_stream_entries`: release extraction streams archive entries.

These exceptions permit reads only. Move their writes through FileAccess too. Do not add a read exception
because a file is read repeatedly; combine the reads at their owner instead.

Use `temporary_writer(folder, mode, suffix)` for temporary files. The funnel removes the temporary path when its context closes. Use `replace` to publish its contents atomically. Parsed values may be retained by path and `FileAccess.shared().version(path)`; that version also changes after writes which preserve file metadata.
