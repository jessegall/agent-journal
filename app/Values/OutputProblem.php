<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\OutputStream;
use App\Enums\ProblemCode;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Why a reader could not vouch for part of a check's output: the stable code, the stream and byte range, the reader
 * revision, a safe explanation and the next action.
 */
#[MapName(SnakeCaseMapper::class)]
final class OutputProblem extends Data
{
    public function __construct(
        public readonly ProblemCode $code,
        public readonly OutputStream|null $stream,
        public readonly int $start,
        public readonly int $end,
        public readonly string $readerRevision,
        public readonly string $explanation,
    ) {}

    /**
     * A problem about the output as a whole rather than a byte range of one stream.
     */
    public static function ofWholeOutput(ProblemCode $code, string $readerRevision, string $explanation): self
    {
        return new self($code, null, 0, 0, $readerRevision, $explanation);
    }

    public function nextAction(): string
    {
        return $this->code->nextAction();
    }
}
