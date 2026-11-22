<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\OutputStream;

/**
 * Committed bytes of one stream at their offset, as a reader receives them.
 */
final readonly class OutputFrame
{
    public function __construct(
        public OutputStream $stream,
        public int $offset,
        public string $bytes,
    ) {}

    public function end(): int
    {
        return $this->offset + strlen($this->bytes);
    }
}
