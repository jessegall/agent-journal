<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Enums\Processes\OutputStream;
use Spatie\LaravelData\Data;

/**
 * One piece of a part's output as it is spooled and sent: the stream, where it starts, and its bytes as base64.
 */
final class RunChunk extends Data
{
    public function __construct(
        public readonly RunPart $part,
        public readonly OutputStream $stream,
        public readonly int $offset,
        public readonly string $bytes,
    ) {}

    public function decodedBytes(): string
    {
        return (string) base64_decode($this->bytes, true);
    }
}
