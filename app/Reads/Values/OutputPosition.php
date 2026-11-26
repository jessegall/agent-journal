<?php

declare(strict_types=1);

namespace App\Reads\Values;

use App\Processes\Enums\OutputStream;

/**
 * How far a part's stream is stored: the byte offset after its last committed chunk.
 */
final readonly class OutputPosition
{
    public function __construct(public OutputStream $stream, public int $offset) {}
}
