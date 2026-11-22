<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

/**
 * A runtime's latest screen as the cache keeps it: plain values only, since the cache unserializes no objects. The
 * registration it was admitted under, the frame, when it arrived, and the streams it replaced.
 */
final class StoredScreenData extends Data
{
    /**
     * @param  array<string, mixed>  $frame  the frame as the host reported it
     * @param  list<string>  $retiredStreams
     */
    public function __construct(
        public readonly string $runtimeId,
        public readonly string $hostId,
        public readonly int $processGeneration,
        public readonly array $frame,
        public readonly string $receivedAt,
        public readonly array $retiredStreams,
    ) {}
}
