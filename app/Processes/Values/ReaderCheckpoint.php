<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\OutputStream;
use App\Records\Enums\RecordRole;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

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
#[MapName(SnakeCaseMapper::class)]
final class ReaderCheckpoint extends Data
{
    /**
     * @param  array<string, int>  $offsets  stream => next offset
     * @param  array<string, string>  $pending  stream => bytes of the unfinished line
     * @param  list<OutputRecord>  $records
     * @param  list<OutputProblem>  $problems
     */
    public function __construct(
        public readonly array $offsets = [],
        public readonly array $pending = [],
        #[DataCollectionOf(OutputRecord::class)]
        public readonly array $records = [],
        #[DataCollectionOf(OutputProblem::class)]
        public readonly array $problems = [],
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
        return array_values(array_filter($this->records, fn (OutputRecord $record) => $record->role === $role));
    }
}
