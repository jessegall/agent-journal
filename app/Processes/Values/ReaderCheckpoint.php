<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\OutputStream;

/**
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
 *
 * Where a reader stands in a part's output: per stream the next offset it expects and the unfinished line it holds,
 * and the provisional records and problems so far. A reader resumes from it after every committed chunk.
 */
final readonly class ReaderCheckpoint
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

    /**
     * @param  CheckpointFields  $fields
     */
    public static function fromArray(array $fields): self
    {
        return new self(
            $fields['offsets'],
            array_map(fn (string $bytes) => (string) base64_decode($bytes, true), $fields['pending']),
            array_map(OutputRecord::fromArray(...), $fields['records']),
            array_map(OutputProblem::fromArray(...), $fields['problems']),
        );
    }
}
