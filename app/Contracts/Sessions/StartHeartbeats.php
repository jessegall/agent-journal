<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

/**
 * What other Core areas use of the Agents area's StartHeartbeats.
 */
interface StartHeartbeats
{
    /**
     * Marks silent every active session whose last beat, or whose start when it never beat, is a presence window old.
     */
    public function markSilentStarts(): void;
}
