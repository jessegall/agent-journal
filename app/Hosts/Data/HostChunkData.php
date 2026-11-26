<?php

declare(strict_types=1);

namespace App\Hosts\Data;

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

    /**
     * The bytes as the process printed them; the host sends them base64 encoded.
     */
    public function printed(): string
    {
        return (string) base64_decode($this->bytes, true);
    }

    /**
     * The offset just past this chunk in its stream.
     */
    public function end(): int
    {
        return $this->offset + strlen($this->printed());
    }
}
