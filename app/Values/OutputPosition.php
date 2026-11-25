<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Processes\OutputStream;

/**
 * How far a part's stream is stored: the byte offset after its last committed chunk.
 */
final readonly class OutputPosition
{
    public function __construct(public OutputStream $stream, public int $offset) {}
}
