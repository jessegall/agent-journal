<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\OutputStream;
use App\Enums\ProblemCode;
use App\Values\OutputProblem;
use Spatie\LaravelData\Data;

/**
 * An output problem as it is stored, the shape OutputProblem::toArray writes: its code, stream, byte range, reader
 * and explanation.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
final class StoredOutputProblem extends Data
{
    public function __construct(
        public readonly ProblemCode $code,
        public readonly OutputStream|null $stream,
        public readonly int $start,
        public readonly int $end,
        public readonly string $reader,
        public readonly string $explanation,
    ) {}

    public function problem(): OutputProblem
    {
        return new OutputProblem(
            $this->code,
            $this->stream,
            $this->start,
            $this->end,
            $this->reader,
            $this->explanation,
        );
    }
}
