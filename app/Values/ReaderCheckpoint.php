<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Settings\StoredValue;
use App\Enums\OutputStream;
use App\Enums\RecordRole;
use App\Support\Stored\StoredReaderCheckpoint;

/**
 * Where a reader stands in a part's output: per stream the next offset it expects and the unfinished line it holds,
 * and the provisional records and problems so far. A reader resumes from it after every committed chunk.
 *
 * @phpstan-type CheckpointFields array{
 *   offsets: array<string, int>,
 *   pending: array<string, string>,
 *   records: list<array{stream: string, start: int, end: int, role: string, captures: array<string, string>}>,
 *   problems: list<array{
 *     code: string,
 *     stream: string|null,
 *     start: int,
 *     end: int,
 *     reader: string,
 *     explanation: string,
 *   }>,
 * }
 */
final readonly class ReaderCheckpoint implements StoredValue
{
    /**
     * @param  array<string, int>  $offsets  stream => next offset
     * @param  array<string, string>  $pending  stream => bytes of the unfinished line
     * @param  list<OutputRecord>  $records
     * @param  list<OutputProblem>  $problems
     */
    public function __construct(
        public array $offsets = [],
        public array $pending = [],
        public array $records = [],
        public array $problems = [],
    ) {}

    public function offsetOf(OutputStream $stream): int
    {
        return $this->offsets[$stream->value] ?? 0;
    }

    public function pendingOf(OutputStream $stream): string
    {
        return $this->pending[$stream->value] ?? '';
    }

    /**
     * The records of one role, in the order they were read.
     *
     * @return list<OutputRecord>
     */
    public function recordsOf(RecordRole $role): array
    {
        return array_values(array_filter($this->records, fn (OutputRecord $record): bool => $record->role === $role));
    }

    /**
     * @return CheckpointFields
     */
    public function toArray(): array
    {
        return [
            'offsets' => $this->offsets,
            'pending' => array_map(base64_encode(...), $this->pending),
            'records' => array_map(fn (OutputRecord $record) => $record->toArray(), $this->records),
            'problems' => array_map(fn (OutputProblem $problem) => $problem->toArray(), $this->problems),
        ];
    }

    public static function fromJson(string $json): self
    {
        return StoredReaderCheckpoint::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR))->checkpoint();
    }

    public static function listFromJson(string $json): array
    {
        return array_values(array_map(
            fn (StoredReaderCheckpoint $stored) => $stored->checkpoint(),
            StoredReaderCheckpoint::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)),
        ));
    }
}
