<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Values\ReaderCheckpoint;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * A reader checkpoint as it is stored, the shape ReaderCheckpoint::toArray writes: the offsets and unfinished lines
 * per stream, with the pending bytes base64 encoded, and the records and problems so far.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
final class StoredReaderCheckpoint extends Data
{
    /**
     * @param  array<string, int>  $offsets
     * @param  array<string, string>  $pending
     * @param  list<StoredOutputRecord>  $records
     * @param  list<StoredOutputProblem>  $problems
     */
    public function __construct(
        public readonly array $offsets,
        public readonly array $pending,
        #[DataCollectionOf(StoredOutputRecord::class)]
        public readonly array $records,
        #[DataCollectionOf(StoredOutputProblem::class)]
        public readonly array $problems,
    ) {}

    public function checkpoint(): ReaderCheckpoint
    {
        return new ReaderCheckpoint(
            $this->offsets,
            array_map(fn (string $bytes) => (string) base64_decode($bytes, true), $this->pending),
            array_map(fn (StoredOutputRecord $record) => $record->record(), $this->records),
            array_map(fn (StoredOutputProblem $problem) => $problem->problem(), $this->problems),
        );
    }
}
