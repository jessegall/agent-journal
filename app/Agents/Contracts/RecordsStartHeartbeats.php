<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

/**
 * What other Core areas use of the Agents area's StartHeartbeats.
 */
interface RecordsStartHeartbeats
{
    /**
     * Marks silent every active session whose last beat, or whose start when it never beat, is a presence window old.
     */
    public function markSilentStarts(): void;
}
