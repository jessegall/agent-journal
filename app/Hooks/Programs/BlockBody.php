<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Enums\ProgramStopDecision;
use Spatie\LaravelData\Data;

/**
 * A reply that blocks: a held stop asks the program to go on, a blocked prompt is not sent. It carries the one reason
 * the agent reads.
 */
final class BlockBody extends Data
{
    public function __construct(
        public readonly ProgramStopDecision $decision,
        public readonly string $reason,
    ) {}
}
