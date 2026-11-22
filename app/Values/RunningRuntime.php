<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The runtime an agent runs in now: its stack target and the generation that made it current.
 */
final readonly class RunningRuntime
{
    public function __construct(public StackTarget $target, public int $generation) {}
}
