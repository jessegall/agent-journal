<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

/**
 * Tells a running supervisor whether its run should stop, and why.
 */
interface StopSignal
{
    /**
     * Whether a stop was asked for.
     */
    public function isRequested(): bool;

    /**
     * Why the stop was asked for.
     */
    public function reason(): string;
}
