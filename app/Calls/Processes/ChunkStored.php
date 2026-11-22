<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use Spatie\LaravelData\Data;

/**
 * How far a part's stream is stored now, so a resent piece before that point is known to be in already.
 */
final class ChunkStored extends Data
{
    public function __construct(public readonly int $stored) {}
}
