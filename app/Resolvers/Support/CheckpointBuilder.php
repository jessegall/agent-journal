<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Enums\Processes\OutputStream;
use App\Enums\Runs\ProblemCode;
use App\Values\OutputProblem;
use App\Values\OutputRecord;
use App\Values\ReaderCheckpoint;

/**
 * Gathers one read's records, problems, offsets and unfinished lines, then builds the next checkpoint once, so a long
 * output is not copied line by line.
 */
final class CheckpointBuilder
{
    /**
     * @var array<string, int>
     */
    private array $offsets;

    /**
     * @var array<string, string>
     */
    private array $pending;

    /**
     * @var list<OutputRecord>
     */
    private array $records;

    /**
     * @var list<OutputProblem>
     */
    private array $problems;

    public function __construct(ReaderCheckpoint $from, private readonly string $readerRevision)
    {
        $this->offsets = $from->offsets;
        $this->pending = $from->pending;
        $this->records = $from->records;
        $this->problems = $from->problems;
    }

    public function offsetOf(OutputStream $stream): int
    {
        return $this->offsets[$stream->value] ?? 0;
    }

    public function pendingOf(OutputStream $stream): string
    {
        return $this->pending[$stream->value] ?? '';
    }

    public function holdUntilMore(OutputStream $stream, string $bytes, int $nextOffset): void
    {
        $this->pending[$stream->value] = $bytes;
        $this->offsets[$stream->value] = $nextOffset;
    }

    public function record(OutputRecord $record): void
    {
        $this->records[] = $record;
    }

    public function problem(ProblemCode $code, OutputStream $stream, int $start, int $end, string $explanation): void
    {
        $this->problems[] = new OutputProblem($code, $stream, $start, $end, $this->readerRevision, $explanation);
    }

    public function problemOfWholeOutput(ProblemCode $code, string $explanation): void
    {
        $this->problems[] = OutputProblem::ofWholeOutput($code, $this->readerRevision, $explanation);
    }

    /**
     * @return list<string>
     */
    public function streamsWithPending(): array
    {
        return array_keys(array_filter($this->pending, fn (string $bytes): bool => $bytes !== ''));
    }

    public function build(): ReaderCheckpoint
    {
        return new ReaderCheckpoint($this->offsets, $this->pending, $this->records, $this->problems);
    }
}
