<?php

declare(strict_types=1);

namespace App\Engine\Contracts;

/**
 * The one lock that makes this process the engine of the installation, held for the life of the process.
 */
interface EngineLock
{
    /**
     * Waits until this process owns the lock.
     */
    public function acquire(): void;

    /**
     * Whether this process still owns the lock on the session it acquired it on.
     */
    public function isHeld(): bool;

    public function release(): void;
}
