<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\ProblemCode;

/**
 * Why a reader could not vouch for part of a check's output: the stable code, the stream and byte range, the reader
 * revision, a safe explanation and the next action.
 */
final class OutputProblem extends Data implements StoredValue
{
    public function __construct(
        public readonly ProblemCode $code,
        public readonly OutputStream|null $stream,
        public readonly int $start,
        public readonly int $end,
        #[MapName('reader')]
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

    public static function fromJson(string $json): self
    {
        return OutputProblem::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR));
    }

    public static function listFromJson(string $json): array
    {
        return array_values(OutputProblem::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)));
    }
}
