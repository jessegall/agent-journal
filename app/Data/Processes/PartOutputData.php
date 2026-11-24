<?php

declare(strict_types=1);

namespace App\Data\Processes;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The tail of one stream of a part, escaped so control bytes and invalid text show as escapes, with the offset it
 * starts at and the stream's full size.
 */
#[TypeScript]
final class PartOutputData extends Data
{
    public function __construct(
        public readonly string $stream,
        public readonly int $startsAt,
        public readonly int $size,
        public readonly string $text,
    ) {}
}
