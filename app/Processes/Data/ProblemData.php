<?php

declare(strict_types=1);

namespace App\Processes\Data;

use App\Processes\Values\OutputProblem;
use Spatie\LaravelData\Data;

/**
 * One problem of a part's output as a person reads it: stable code, stream and byte range, the reader revision, the
 * explanation and the next action.
 */
final class ProblemData extends Data
{
    public function __construct(
        public readonly string $code,
        public readonly string $stream,
        public readonly int $start,
        public readonly int $end,
        public readonly string $readerRevision,
        public readonly string $explanation,
        public readonly string $nextAction,
    ) {}

    public static function fromProblem(OutputProblem $problem): self
    {
        return new self(
            $problem->code->value,
            $problem->stream === null ? 'whole output' : $problem->stream->value,
            $problem->start,
            $problem->end,
            $problem->readerRevision,
            $problem->explanation,
            $problem->nextAction(),
        );
    }
}
