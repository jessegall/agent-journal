<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Waits for a while; the engine sleeps through one between its passes.
 */
interface Sleeper
{
    public function sleep(int $nanoseconds): void;
}
