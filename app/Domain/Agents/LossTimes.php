<?php

declare(strict_types=1);

namespace App\Domain\Agents;

/**
 * How long a launch may stay silent before its loss is suspected, and how long a suspicion lasts before the loss is confirmed.
 */
final readonly class LossTimes
{
    public function __construct(
        public int $suspectAfterSeconds = 120,
        public int $confirmAfterSeconds = 900,
    ) {}
}
