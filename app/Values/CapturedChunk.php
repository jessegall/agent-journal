<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\OutputStream;
use App\Models\PartRun;
use Carbon\CarbonImmutable;

/**
 * Bytes one part wrote to one stream, as they were read, with the time they were captured.
 */
final readonly class CapturedChunk
{
    public function __construct(
        public PartRun $part,
        public OutputStream $stream,
        public string $bytes,
        public CarbonImmutable $capturedAt,
    ) {}
}
