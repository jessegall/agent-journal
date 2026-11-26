<?php

declare(strict_types=1);

namespace App\Data\Hosts;

use Spatie\LaravelData\Data;

/**
 * Bytes a process wrote on one of its streams, from an offset, base64 encoded.
 */
final class HostChunkData extends Data
{
    public function __construct(
        public readonly string $stream,
        public readonly int $offset,
        public readonly string $bytes,
    ) {}
}
