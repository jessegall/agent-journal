<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

/**
 * Tells a running supervisor whether its run should stop, and why.
 */
interface StopSignal
{
    public function isRequested(): bool;

    public function reason(): string;
}
