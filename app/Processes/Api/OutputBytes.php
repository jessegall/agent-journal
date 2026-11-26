<?php

declare(strict_types=1);

namespace App\Processes\Api;

use Spatie\LaravelData\Data;

/**
 * A part's whole stream as base64, and its length in bytes.
 */
final class OutputBytes extends Data
{
    public function __construct(
        public readonly string $label,
        public readonly string $stream,
        public readonly string $bytes,
        public readonly int $length,
    ) {}

    public function decoded(): string
    {
        return (string) base64_decode($this->bytes, true);
    }
}
