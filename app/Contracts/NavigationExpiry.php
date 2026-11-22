<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * What the engine's sweep asks of the Agents area's navigation requests.
 */
interface NavigationExpiry
{
    /**
     * Expires every open navigation request whose time ran out: its key script ends entry_unavailable, its runtime
     * is held no longer, and the user is told.
     */
    public function expireDue(): void;
}
